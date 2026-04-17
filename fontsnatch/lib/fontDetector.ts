import type { FontResult, FontVariant, FontSource } from './types';
import { enrichFont } from './fontDatabase';

// ─── Regex helpers ────────────────────────────────────────────────────────────
const RE_GOOGLE_FONTS_HREF = /https?:\/\/fonts\.googleapis\.com\/css[^"'\s>)]+/gi;
const RE_BUNNY_FONTS_HREF  = /https?:\/\/fonts\.bunny\.net\/css[^"'\s>)]+/gi;
const RE_TYPEKIT_SCRIPT    = /https?:\/\/(use|p)\.typekit\.net\/[a-z0-9]+\.(js|css)/gi;
const RE_CSS_LINK          = /href=["']([^"']+\.css[^"']*)/gi;
const RE_STYLE_BLOCK       = /<style[^>]*>([\s\S]*?)<\/style>/gi;
const RE_FONT_FACE         = /@font-face\s*\{([^}]+)\}/gi;
const RE_FONT_FAMILY_DECL  = /font-family\s*:\s*([^;!}]+)/gi;
const RE_IMPORT_URL        = /@import\s+(?:url\(['"]?|['"])([^'")]+)/gi;
const RE_PAGE_TITLE        = /<title[^>]*>([^<]+)<\/title>/i;

const SYSTEM_FONT_NAMES = new Set([
  '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'roboto', 'oxygen',
  'ubuntu', 'cantarell', 'helvetica neue', 'helvetica', 'arial', 'sans-serif',
  'serif', 'monospace', 'georgia', 'times new roman', 'times', 'verdana',
  'trebuchet ms', 'courier new', 'courier', 'system-ui', 'ui-sans-serif',
  'ui-serif', 'ui-monospace', 'ui-rounded', 'lucida console', 'sf pro',
  'sf pro display', 'sf pro text',
]);

// ─── Google Fonts URL parser ──────────────────────────────────────────────────
function parseGoogleFontsUrl(url: string): { name: string; variants: FontVariant[] }[] {
  const queryStart = url.indexOf('?');
  if (queryStart === -1) return [];
  const query = url.slice(queryStart + 1);

  // Collect all `family=` params manually (URLSearchParams merges duplicates)
  const families: string[] = [];
  const parts = query.split('&');
  for (const part of parts) {
    if (part.startsWith('family=')) {
      families.push(decodeURIComponent(part.slice(7)));
    }
  }

  return families.map((family) => {
    const [rawName, axisStr] = family.split(':');
    const name = rawName.replace(/\+/g, ' ').trim();

    const variants: FontVariant[] = [];

    if (!axisStr) {
      variants.push({ weight: '400', style: 'normal' });
    } else {
      // Handle CSS2 axis format: ital,wght@0,300;0,400;1,400
      // or simple: wght@300;400;700
      const atIdx = axisStr.indexOf('@');
      if (atIdx === -1) {
        variants.push({ weight: '400', style: 'normal' });
      } else {
        const axisNames = axisStr.slice(0, atIdx).split(',').map((a) => a.trim());
        const valueSets = axisStr.slice(atIdx + 1).split(';');

        const italIdx = axisNames.indexOf('ital');
        const wghtIdx = axisNames.findIndex((a) => a === 'wght');

        for (const valSet of valueSets) {
          const vals = valSet.split(',');
          if (axisNames.length === 1) {
            // Single axis
            if (wghtIdx !== -1 || axisNames[0] === 'wght') {
              // Could be range like 100..900
              const wv = vals[0];
              if (wv.includes('..')) {
                const [lo, hi] = wv.split('..').map(Number);
                for (let w = lo; w <= hi; w += 100) {
                  if (!variants.find(v => v.weight === String(w) && v.style === 'normal')) {
                    variants.push({ weight: String(w), style: 'normal' });
                  }
                }
              } else {
                variants.push({ weight: wv || '400', style: 'normal' });
              }
            }
          } else {
            // Multi-axis
            const ital = italIdx !== -1 ? vals[italIdx] : '0';
            const wght = wghtIdx !== -1 ? vals[wghtIdx] : vals[vals.length - 1];
            variants.push({
              weight: wght || '400',
              style: ital === '1' ? 'italic' : 'normal',
            });
          }
        }
      }
    }

    if (variants.length === 0) {
      variants.push({ weight: '400', style: 'normal' });
    }

    return { name, variants };
  });
}

// ─── CSS @font-face parser ────────────────────────────────────────────────────
function parseFontFaceBlocks(
  css: string,
  source: FontSource,
  collected: Map<string, { source: FontSource; variants: FontVariant[] }>
) {
  let match: RegExpExecArray | null;
  RE_FONT_FACE.lastIndex = 0;

  while ((match = RE_FONT_FACE.exec(css)) !== null) {
    const block = match[1];

    const famMatch = /font-family\s*:\s*(['"]?)([^;'"]+)\1/.exec(block);
    if (!famMatch) continue;
    const name = famMatch[2].trim();

    const wMatch = /font-weight\s*:\s*([^;]+)/.exec(block);
    const sMatch = /font-style\s*:\s*([^;]+)/.exec(block);

    const rawWeight = wMatch ? wMatch[1].trim() : '400';
    const style = sMatch && sMatch[1].includes('italic') ? 'italic' : ('normal' as const);

    // Weight might be a range like "100 900" — normalize
    const weight = rawWeight.includes(' ')
      ? rawWeight // keep range for display
      : rawWeight;

    const existing = collected.get(name);
    if (existing) {
      const hasVariant = existing.variants.some(
        (v) => v.weight === weight && v.style === style
      );
      if (!hasVariant) {
        existing.variants.push({ weight, style });
      }
    } else {
      collected.set(name, { source, variants: [{ weight, style }] });
    }
  }
}

// ─── CSS font-family usage scanner ───────────────────────────────────────────
function parseFontFamilyUsage(
  css: string,
  collected: Map<string, { source: FontSource; variants: FontVariant[] }>
) {
  // Strip @font-face blocks first to avoid double-counting
  const stripped = css.replace(/@font-face\s*\{[^}]+\}/gi, '');

  RE_FONT_FAMILY_DECL.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = RE_FONT_FAMILY_DECL.exec(stripped)) !== null) {
    const families = match[1].split(',');
    for (const raw of families) {
      const name = raw.trim().replace(/['"]/g, '').trim();
      if (!name || name === 'inherit' || name === 'initial' || name === 'unset') continue;

      const lc = name.toLowerCase();
      if (
        lc === 'sans-serif' ||
        lc === 'serif' ||
        lc === 'monospace' ||
        lc === 'cursive' ||
        lc === 'fantasy' ||
        lc === 'system-ui' ||
        lc === 'ui-sans-serif' ||
        lc === 'ui-serif' ||
        lc === 'ui-monospace'
      ) {
        continue;
      }

      // Only add if not already collected
      if (!collected.has(name)) {
        const isSystem = SYSTEM_FONT_NAMES.has(lc);
        collected.set(name, {
          source: isSystem ? 'system' : 'custom',
          variants: [{ weight: '400', style: 'normal' }],
        });
      }
    }
  }
}

// ─── HTTP fetch helpers ───────────────────────────────────────────────────────
const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/css,*/*;q=0.5',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchWithTimeout(url: string, timeoutMs = 6000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return '';
  }
}

// ─── Main detection function ──────────────────────────────────────────────────
export async function detectFonts(rawUrl: string): Promise<{
  fonts: FontResult[];
  pageTitle?: string;
}> {
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  // 1. Fetch the page HTML
  const html = await fetchWithTimeout(url, 8000);

  const pageTitle = RE_PAGE_TITLE.exec(html)?.[1]?.trim();

  // Collected: name → { source, variants }
  const collected = new Map<string, { source: FontSource; variants: FontVariant[] }>();

  // Track Google Fonts URLs for preview loading
  const googleFontsCssUrls = new Map<string, string>(); // name → CSS URL

  // 2. ── Detect Google Fonts links ─────────────────────────────────────────
  const googleMatches = [...html.matchAll(new RegExp(RE_GOOGLE_FONTS_HREF.source, 'gi'))];
  for (const m of googleMatches) {
    const gUrl = m[0];
    const parsed = parseGoogleFontsUrl(gUrl);
    for (const { name, variants } of parsed) {
      const existing = collected.get(name);
      if (existing) {
        // Merge variants
        for (const v of variants) {
          if (!existing.variants.find((ev) => ev.weight === v.weight && ev.style === v.style)) {
            existing.variants.push(v);
          }
        }
      } else {
        collected.set(name, { source: 'google', variants });
        googleFontsCssUrls.set(name, gUrl);
      }
    }
  }

  // 3. ── Detect Bunny Fonts ─────────────────────────────────────────────────
  const bunnyMatches = [...html.matchAll(new RegExp(RE_BUNNY_FONTS_HREF.source, 'gi'))];
  for (const m of bunnyMatches) {
    const bUrl = m[0].replace('fonts.bunny.net', 'fonts.googleapis.com');
    const parsed = parseGoogleFontsUrl(bUrl);
    for (const { name, variants } of parsed) {
      if (!collected.has(name)) {
        collected.set(name, { source: 'bunny', variants });
      }
    }
  }

  // 4. ── Detect Adobe Fonts (Typekit) ──────────────────────────────────────
  const typekitMatches = [...html.matchAll(new RegExp(RE_TYPEKIT_SCRIPT.source, 'gi'))];
  if (typekitMatches.length > 0) {
    // Fetch the Typekit CSS to get actual font names
    for (const m of typekitMatches) {
      const tkUrl = m[0];
      try {
        const tkCss = await fetchWithTimeout(tkUrl, 4000);
        parseFontFaceBlocks(tkCss, 'adobe', collected);
      } catch {
        // Typekit kits often block; mark generically
        collected.set('Adobe Fonts (Typekit)', {
          source: 'adobe',
          variants: [{ weight: '400', style: 'normal' }],
        });
      }
    }
  }

  // 5. ── Gather CSS sources (inline + external) ─────────────────────────────
  const cssSources: string[] = [];

  // Inline <style> blocks
  const styleBlocks = [...html.matchAll(new RegExp(RE_STYLE_BLOCK.source, 'gi'))];
  for (const m of styleBlocks) {
    cssSources.push(m[1]);
  }

  // External stylesheets (limit to first 8)
  const cssLinks: string[] = [];
  const linkMatches = [...html.matchAll(new RegExp(RE_CSS_LINK.source, 'gi'))];
  for (const m of linkMatches) {
    const href = m[1];
    if (
      href.includes('fonts.googleapis') ||
      href.includes('fonts.bunny') ||
      href.includes('typekit')
    ) {
      continue; // already handled
    }
    const resolved = resolveUrl(href, url);
    if (resolved) cssLinks.push(resolved);
    if (cssLinks.length >= 8) break;
  }

  // Fetch external CSS in parallel
  const cssResults = await Promise.allSettled(
    cssLinks.map((href) => fetchWithTimeout(href, 4000))
  );
  for (const r of cssResults) {
    if (r.status === 'fulfilled') cssSources.push(r.value);
  }

  // 6. ── Parse all CSS for @font-face + font-family usage ──────────────────
  for (const css of cssSources) {
    // Check for @import Google Fonts
    RE_IMPORT_URL.lastIndex = 0;
    let impMatch: RegExpExecArray | null;
    while ((impMatch = RE_IMPORT_URL.exec(css)) !== null) {
      const importUrl = impMatch[1];
      if (importUrl.includes('fonts.googleapis.com')) {
        const parsed = parseGoogleFontsUrl(importUrl);
        for (const { name, variants } of parsed) {
          if (!collected.has(name)) {
            collected.set(name, { source: 'google', variants });
            googleFontsCssUrls.set(name, importUrl);
          }
        }
      }
    }

    parseFontFaceBlocks(css, 'custom', collected);
    parseFontFamilyUsage(css, collected);
  }

  // 7. ── Build result objects ───────────────────────────────────────────────
  const SKIP_NAMES = new Set([
    '', 'inherit', 'initial', 'unset', 'none', 'normal',
    'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
  ]);

  const fonts: FontResult[] = [];
  let idx = 0;

  for (const [name, { source, variants }] of collected.entries()) {
    if (SKIP_NAMES.has(name.toLowerCase())) continue;

    const enriched = enrichFont(name, source);

    fonts.push({
      id: `font-${idx++}`,
      name,
      cssFamily: `'${name}', ${enriched.category === 'serif' ? 'serif' : enriched.category === 'monospace' ? 'monospace' : 'sans-serif'}`,
      category: enriched.category,
      source,
      license: enriched.license,
      foundry: enriched.foundry,
      description: enriched.description,
      variants: deduplicateVariants(variants),
      downloadUrl: enriched.downloadUrl,
      purchaseUrl: enriched.purchaseUrl,
      googleFontsUrl: googleFontsCssUrls.get(name),
    });
  }

  // Sort: google first, then adobe, then custom, then system
  const ORDER: Record<string, number> = { google: 0, adobe: 1, bunny: 2, custom: 3, system: 4 };
  fonts.sort((a, b) => (ORDER[a.source] ?? 9) - (ORDER[b.source] ?? 9));

  return { fonts, pageTitle };
}

function deduplicateVariants(variants: FontVariant[]): FontVariant[] {
  const seen = new Set<string>();
  return variants.filter((v) => {
    const key = `${v.weight}-${v.style}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
