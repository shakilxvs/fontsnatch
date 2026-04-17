import type { FontCategory, FontLicense } from './types';

interface FontMeta {
  foundry?: string;
  category?: FontCategory;
  license?: FontLicense;
  description?: string;
  downloadUrl?: string;
  purchaseUrl?: string;
}

// Curated database for common fonts — Google Fonts are auto-enriched,
// system/paid fonts need manual entries.
export const FONT_DATABASE: Record<string, FontMeta> = {
  // ── Google Fonts (open-source, enriched separately) ──────────────────────
  'Inter': {
    foundry: 'Rasmus Andersson',
    category: 'sans-serif',
    description: 'A typeface carefully crafted & optimised for computer screens',
  },
  'Roboto': {
    foundry: 'Christian Robertson',
    category: 'sans-serif',
    description: 'A mechanical skeleton with largely geometric forms',
  },
  'Open Sans': {
    foundry: 'Steve Matteson',
    category: 'sans-serif',
    description: 'Optimised for legibility across print, web, and mobile',
  },
  'Lato': {
    foundry: 'Łukasz Dziedzic',
    category: 'sans-serif',
    description: 'Semi-rounded details give warmth while maintaining stability',
  },
  'Montserrat': {
    foundry: 'Julieta Ulanovsky',
    category: 'sans-serif',
    description: 'Inspired by the signage posters of Buenos Aires',
  },
  'Raleway': {
    foundry: 'Matt McInerney',
    category: 'sans-serif',
    description: 'An elegant sans-serif display typeface',
  },
  'Poppins': {
    foundry: 'Indian Type Foundry',
    category: 'sans-serif',
    description: 'Geometric sans-serif with circular stroke endings',
  },
  'Nunito': {
    foundry: 'Vernon Adams',
    category: 'sans-serif',
    description: 'Well-balanced sans-serif with rounded terminals',
  },
  'Source Sans Pro': {
    foundry: 'Paul D. Hunt / Adobe',
    category: 'sans-serif',
    description: "Adobe's first open-source typeface family",
  },
  'Noto Sans': {
    foundry: 'Google',
    category: 'sans-serif',
    description: 'Universal typeface supporting all scripts',
  },
  'Ubuntu': {
    foundry: 'Dalton Maag',
    category: 'sans-serif',
    description: 'Humanist sans-serif with distinct Ubuntu character',
  },
  'Outfit': {
    foundry: 'Rodrigo Fuenzalida',
    category: 'sans-serif',
    description: 'Clean geometric sans for modern interfaces',
  },
  'DM Sans': {
    foundry: 'Colophon Foundry / Google',
    category: 'sans-serif',
    description: 'Low-contrast geometric sans-serif for small text sizes',
  },
  'Syne': {
    foundry: 'Bonjour Monde',
    category: 'display',
    description: 'Variable type family designed for creative expression',
  },
  'Epilogue': {
    foundry: 'Tyler Finck',
    category: 'sans-serif',
    description: 'A realist sans with utilitarian display qualities',
  },
  'Space Grotesk': {
    foundry: 'Florian Karsten',
    category: 'sans-serif',
    description: 'Proportional sans-serif derived from Space Mono',
  },
  'Plus Jakarta Sans': {
    foundry: 'Tokotype',
    category: 'sans-serif',
    description: 'Clean geometric sans with a modern geometric touch',
  },
  'Geist': {
    foundry: 'Vercel',
    category: 'sans-serif',
    description: 'A typeface for developers and designers by Vercel',
  },
  // ── Google Serif ──────────────────────────────────────────────────────────
  'Playfair Display': {
    foundry: 'Claus Eggers Sørensen',
    category: 'serif',
    description: 'Transitional design influenced by 18th-century letterforms',
  },
  'Merriweather': {
    foundry: 'Sorkin Type',
    category: 'serif',
    description: 'Designed for comfortable reading on screens',
  },
  'Lora': {
    foundry: 'Cyreal',
    category: 'serif',
    description: 'Well-balanced contemporary serif with calligraphic roots',
  },
  'PT Serif': {
    foundry: 'ParaType',
    category: 'serif',
    description: 'Part of the Public Type project for multi-language publishing',
  },
  'Source Serif Pro': {
    foundry: 'Frank Grießhammer / Adobe',
    category: 'serif',
    description: "A companion to Adobe's Source Sans Pro",
  },
  'Libre Baskerville': {
    foundry: 'Impallari Type',
    category: 'serif',
    description: 'A web font optimised for text on-screen',
  },
  'EB Garamond': {
    foundry: 'Georg Duffner',
    category: 'serif',
    description: "Revival of Claude Garamond's 16th-century typeface",
  },
  'Cormorant Garamond': {
    foundry: 'Christian Thalmann',
    category: 'serif',
    description: 'A fine display typeface in the old-style tradition',
  },
  'DM Serif Display': {
    foundry: 'Colophon Foundry / Google',
    category: 'serif',
    description: 'High contrast transitional display typeface',
  },
  'Fraunces': {
    foundry: 'Undercase Type',
    category: 'serif',
    description: '"Old Style" soft-serif, chunky in display sizes',
  },
  // ── Google Display / Decorative ───────────────────────────────────────────
  'Bebas Neue': {
    foundry: 'Ryoichi Tsunekawa',
    category: 'display',
    description: 'Bold all-caps display typeface for strong headlines',
  },
  'Oswald': {
    foundry: 'Vernon Adams',
    category: 'display',
    description: 'Reworking of classic style of gothic and condensed styles',
  },
  'Anton': {
    foundry: 'Vernon Adams',
    category: 'display',
    description: 'Single-weight display condensed font',
  },
  'Righteous': {
    foundry: 'Astigmatic',
    category: 'display',
    description: 'A bold display face with retro flavour',
  },
  'Archivo Black': {
    foundry: 'Omnibus-Type',
    category: 'display',
    description: 'Grotesque sans-serif typeface family',
  },
  'Clash Display': {
    foundry: 'Indian Type Foundry',
    category: 'display',
    description: 'Geometric display typeface with high visual impact',
  },
  // ── Google Monospace ──────────────────────────────────────────────────────
  'Fira Code': {
    foundry: 'Nikita Prokopov',
    category: 'monospace',
    description: 'Monospaced font with programming ligatures',
  },
  'Source Code Pro': {
    foundry: 'Paul D. Hunt / Adobe',
    category: 'monospace',
    description: "Adobe's monospaced companion to Source Sans Pro",
  },
  'JetBrains Mono': {
    foundry: 'JetBrains',
    category: 'monospace',
    description: 'Typeface for developers, with coding ligatures',
  },
  'Space Mono': {
    foundry: 'Colophon Foundry / Google',
    category: 'monospace',
    description: 'Fixed-width type family for code and technical UI',
  },
  'Roboto Mono': {
    foundry: 'Christian Robertson',
    category: 'monospace',
    description: 'Monospaced member of the Roboto superfamily',
  },
  'IBM Plex Mono': {
    foundry: 'Bold Monday / IBM',
    category: 'monospace',
    description: "IBM's corporate typeface family, mono variant",
  },
  // ── Adobe / Paid fonts ────────────────────────────────────────────────────
  'Proxima Nova': {
    foundry: 'Mark Simonson Studio',
    category: 'sans-serif',
    license: 'paid',
    description: 'The go-to workhorse of web design — geometric with humanist proportions',
    purchaseUrl: 'https://www.marksimonson.com/fonts/view/proxima-nova',
  },
  'Futura PT': {
    foundry: 'Paul Renner / ParaType',
    category: 'sans-serif',
    license: 'paid',
    description: 'The iconic 1927 Futura, adapted for digital use',
    purchaseUrl: 'https://www.myfonts.com/products/pt-futura-pt-222496',
  },
  'Aktiv Grotesk': {
    foundry: 'Dalton Maag',
    category: 'sans-serif',
    license: 'paid',
    description: 'A fresh and neutral grotesque sans-serif',
    purchaseUrl: 'https://www.daltonmaag.com/library/aktiv-grotesk',
  },
  'Neue Haas Grotesk': {
    foundry: 'Linotype',
    category: 'sans-serif',
    license: 'paid',
    description: 'The original design that Helvetica was based upon',
    purchaseUrl: 'https://www.myfonts.com/products/neue-haas-grotesk',
  },
  'Graphik': {
    foundry: 'Commercial Type',
    category: 'sans-serif',
    license: 'paid',
    description: 'A versatile grotesque sans-serif for all uses',
    purchaseUrl: 'https://commercialtype.com/catalog/graphik',
  },
  'GT Walsheim': {
    foundry: 'Grilli Type',
    category: 'sans-serif',
    license: 'paid',
    description: 'Swiss-style geometric grotesque with humanist details',
    purchaseUrl: 'https://www.grillitype.com/typeface/gt-walsheim',
  },
  'GT America': {
    foundry: 'Grilli Type',
    category: 'sans-serif',
    license: 'paid',
    purchaseUrl: 'https://www.grillitype.com/typeface/gt-america',
  },
  'Canela': {
    foundry: 'Commercial Type',
    category: 'serif',
    license: 'paid',
    description: 'A display serif with sharp serifs and high contrast',
    purchaseUrl: 'https://commercialtype.com/catalog/canela',
  },
  'Tiempos Headline': {
    foundry: 'Klim Type Foundry',
    category: 'serif',
    license: 'paid',
    purchaseUrl: 'https://klim.co.nz/retail-fonts/tiempos-headline/',
  },
  'Domaine Display': {
    foundry: 'Klim Type Foundry',
    category: 'serif',
    license: 'paid',
    purchaseUrl: 'https://klim.co.nz/retail-fonts/domaine-display/',
  },
  // ── System / OS fonts ─────────────────────────────────────────────────────
  'Arial': {
    foundry: 'Robin Nicholas & Patricia Saunders / Microsoft',
    category: 'sans-serif',
    license: 'system',
    description: 'Bundled with Windows and macOS — the ubiquitous fallback',
  },
  'Helvetica Neue': {
    foundry: 'Max Miedinger / Linotype',
    category: 'sans-serif',
    license: 'paid',
    description: 'The definitive Swiss grotesque — backbone of Swiss design',
    purchaseUrl: 'https://www.myfonts.com/products/neue-helvetica-helvetica-9430',
  },
  'Helvetica': {
    foundry: 'Max Miedinger / Haas',
    category: 'sans-serif',
    license: 'paid',
    description: 'Arguably the most famous typeface in history',
    purchaseUrl: 'https://www.myfonts.com/products/helvetica-linotype-helvetica-9435',
  },
  'Georgia': {
    foundry: 'Matthew Carter / Microsoft',
    category: 'serif',
    license: 'system',
    description: 'A transitional serif designed for on-screen clarity',
  },
  'Times New Roman': {
    foundry: 'Stanley Morison / Monotype',
    category: 'serif',
    license: 'paid',
    description: 'The default serif of browsers and documents worldwide',
    purchaseUrl: 'https://www.myfonts.com/products/times-new-roman-monotype-imaging',
  },
  'Verdana': {
    foundry: 'Matthew Carter / Microsoft',
    category: 'sans-serif',
    license: 'system',
    description: 'Designed for legibility on low-resolution screens',
  },
  'Trebuchet MS': {
    foundry: 'Vincent Connare / Microsoft',
    category: 'sans-serif',
    license: 'system',
    description: 'A humanist sans-serif bundled with Windows',
  },
  '-apple-system': {
    foundry: 'Apple',
    category: 'sans-serif',
    license: 'system',
    description: 'San Francisco — the Apple system UI font',
  },
  'BlinkMacSystemFont': {
    foundry: 'Apple / Google',
    category: 'sans-serif',
    license: 'system',
    description: 'System UI font flag used in Chrome/Blink on macOS',
  },
  'Segoe UI': {
    foundry: 'Monotype / Microsoft',
    category: 'sans-serif',
    license: 'system',
    description: 'The default UI typeface for Windows Vista and later',
  },
  'system-ui': {
    foundry: 'OS-native',
    category: 'sans-serif',
    license: 'system',
    description: 'Maps to the native system UI font on each platform',
  },
  'SF Pro': {
    foundry: 'Apple',
    category: 'sans-serif',
    license: 'system',
    description: "Apple's system font for macOS and iOS interfaces",
  },
  'Courier New': {
    foundry: 'Howard Kettler / Microsoft',
    category: 'monospace',
    license: 'system',
    description: 'The classic typewriter-style monospace font',
  },
  'Lucida Console': {
    foundry: 'Bigelow & Holmes / Microsoft',
    category: 'monospace',
    license: 'system',
    description: 'A screen-optimised monospace for coding and terminals',
  },
};

export function enrichFont(name: string, source: 'google' | 'adobe' | 'bunny' | 'custom' | 'system') {
  const cleanName = name.replace(/['"]/g, '').trim();
  const meta = FONT_DATABASE[cleanName];

  // Auto-enrich Google Fonts
  if (source === 'google') {
    return {
      foundry: meta?.foundry ?? 'Google Fonts Contributor',
      category: meta?.category ?? ('sans-serif' as const),
      license: 'open-source' as const,
      description: meta?.description,
      downloadUrl: `https://fonts.google.com/specimen/${encodeURIComponent(cleanName.replace(/ /g, '+'))}`,
      purchaseUrl: undefined,
    };
  }

  if (source === 'bunny') {
    return {
      foundry: meta?.foundry ?? 'Unknown',
      category: meta?.category ?? ('sans-serif' as const),
      license: 'open-source' as const,
      description: meta?.description ?? 'Served via Bunny Fonts CDN (privacy-friendly Google Fonts mirror)',
      downloadUrl: `https://fonts.google.com/specimen/${encodeURIComponent(cleanName.replace(/ /g, '+'))}`,
    };
  }

  if (source === 'adobe') {
    return {
      foundry: meta?.foundry ?? 'Adobe Fonts',
      category: meta?.category ?? ('sans-serif' as const),
      license: (meta?.license ?? 'paid') as FontLicense,
      description: meta?.description ?? 'Served via Adobe Fonts (Typekit) — requires Creative Cloud subscription',
      downloadUrl: undefined,
      purchaseUrl: meta?.purchaseUrl ?? 'https://fonts.adobe.com',
    };
  }

  if (source === 'system') {
    return {
      foundry: meta?.foundry ?? 'Unknown',
      category: meta?.category ?? ('sans-serif' as const),
      license: 'system' as const,
      description: meta?.description ?? 'A system or OS-bundled font',
      downloadUrl: undefined,
      purchaseUrl: undefined,
    };
  }

  // Custom / self-hosted
  return {
    foundry: meta?.foundry ?? 'Custom / Self-hosted',
    category: meta?.category ?? ('unknown' as const),
    license: (meta?.license ?? 'unknown') as FontLicense,
    description: meta?.description ?? 'Self-hosted custom font',
    downloadUrl: meta?.downloadUrl,
    purchaseUrl: meta?.purchaseUrl,
  };
}
