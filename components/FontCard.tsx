'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Download,
  ShoppingCart,
  Copy,
  Check,
  ExternalLink,
  Type,
  Code,
  ChevronDown,
} from 'lucide-react';
import type { FontResult } from '@/lib/types';

const SOURCE_LABELS: Record<string, string> = {
  google: 'Google Fonts',
  adobe: 'Adobe Fonts',
  bunny: 'Bunny Fonts',
  custom: 'Self-hosted',
  system: 'System Font',
};

const LICENSE_LABELS: Record<string, string> = {
  'open-source': 'Open Source',
  paid: 'Paid',
  system: 'System',
  unknown: 'Unknown',
};

interface FontCardProps {
  font: FontResult;
}

export default function FontCard({ font }: FontCardProps) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [previewText, setPreviewText] = useState('Aa Bb 123');
  const linkRef = useRef<HTMLLinkElement | null>(null);

  // Resolve the effective font family string for preview rendering
  const previewFontFamily = (() => {
    if (font.source === 'google' || font.source === 'bunny') {
      return `'${font.name}', sans-serif`;
    }
    if (font.source === 'system') {
      return font.name;
    }
    // Custom / self-hosted: use the CSS variable or font name directly.
    // CSS variable names (var(--font-xxx)) are used as-is so the browser
    // resolves them if the variable happens to be defined. Plain font names
    // are wrapped in quotes so the browser can attempt a match.
    if (font.name.startsWith('var(')) {
      return font.name;
    }
    return `'${font.name}', sans-serif`;
  })();

  // Dynamically load Google/Bunny fonts for preview
  useEffect(() => {
    if (font.source !== 'google' && font.source !== 'bunny') {
      setFontLoaded(true);
      return;
    }
    const encodedName = encodeURIComponent(font.name);
    const href = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400;700&display=swap`;

    if (!document.querySelector(`link[data-font="${font.name}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-font', font.name);
      link.onload = () => setFontLoaded(true);
      link.onerror = () => setFontLoaded(true);
      document.head.appendChild(link);
      linkRef.current = link;
    } else {
      setFontLoaded(true);
    }
  }, [font]);

  const cssSnippet = `font-family: '${font.name}', ${
    font.category === 'serif' ? 'serif' : font.category === 'monospace' ? 'monospace' : 'sans-serif'
  };`;

  const handleCopyFamily = async () => {
    await navigator.clipboard.writeText(cssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCss = async () => {
    const importStatement =
      font.source === 'google'
        ? `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            font.name
          )}:wght@400;700&display=swap');\n\n${cssSnippet}`
        : cssSnippet;
    await navigator.clipboard.writeText(importStatement);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const sourceBadgeClass = `badge-${font.source}`;
  const licenseBadgeClass =
    font.license === 'open-source' ? 'badge-oss' : font.license === 'paid' ? 'badge-paid' : 'badge-sys';

  const sortedVariants = [...font.variants].sort((a, b) => {
    const wa = parseInt(a.weight) || 400;
    const wb = parseInt(b.weight) || 400;
    return wa - wb;
  });

  return (
    <article
      className="font-card group relative flex flex-col rounded-xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,124,247,0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Preview Area */}
      <div
        className="relative px-6 pt-7 pb-5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {font.source === 'custom' && font.name.startsWith('var(') ? (
          /* CSS-variable font: can't be loaded cross-origin, show a clear message */
          <div style={{ minHeight: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <div
              className="preview-text mb-1"
              style={{ fontFamily: previewFontFamily, opacity: 0.25, transition: 'opacity 0.4s' }}
            >
              {previewText}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Type size={10} style={{ display: 'inline', flexShrink: 0 }} />
              Self-hosted — preview unavailable
            </div>
          </div>
        ) : (
          <>
            <div
              className="preview-text mb-1"
              style={{
                fontFamily: previewFontFamily,
                opacity: fontLoaded ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }}
            >
              {previewText}
            </div>

            {/* Editable preview label */}
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '4px' }}>
              <Type size={10} style={{ display: 'inline', marginRight: '4px' }} />
              click to edit preview
            </div>

            {/* Invisible editable overlay */}
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              maxLength={24}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'text',
                width: '100%',
                height: '100%',
              }}
              title="Click to type preview text"
            />
          </>
        )}
      </div>

      {/* Info Area */}
      <div className="flex flex-col flex-1 px-6 pt-5 pb-4 gap-3">
        {/* Name + foundry */}
        <div>
          <h3
            className="font-syne"
            style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ivory)', letterSpacing: '-0.01em' }}
          >
            {font.name}
          </h3>
          {font.foundry && (
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>
              {font.foundry}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`${sourceBadgeClass} px-2 py-0.5 rounded-full text-xs font-medium`}
            style={{ border: '1px solid', fontFamily: 'var(--font-epilogue)' }}
          >
            {SOURCE_LABELS[font.source]}
          </span>
          <span
            className={`${licenseBadgeClass} px-2 py-0.5 rounded-full text-xs font-medium`}
            style={{ border: '1px solid', fontFamily: 'var(--font-epilogue)' }}
          >
            {LICENSE_LABELS[font.license] ?? font.license}
          </span>
          {font.category !== 'unknown' && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--ivory-dim)',
                fontFamily: 'var(--font-epilogue)',
              }}
            >
              {font.category}
            </span>
          )}
        </div>

        {/* Description */}
        {font.description && (
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            {font.description}
          </p>
        )}

        {/* Variants */}
        {sortedVariants.length > 0 && (
          <div>
            <button
              onClick={() => setShowVariants(!showVariants)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: 'var(--muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'var(--font-epilogue)',
              }}
            >
              <ChevronDown
                size={12}
                style={{
                  transition: 'transform 0.2s',
                  transform: showVariants ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
              {sortedVariants.length} variant{sortedVariants.length !== 1 ? 's' : ''}
            </button>

            {showVariants && (
              <div
                className="flex flex-wrap gap-1 mt-2"
                style={{ animation: 'fadeIn 0.2s ease-out' }}
              >
                {sortedVariants.map((v, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '2px 8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      color: 'var(--ivory-dim)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {v.weight}
                    {v.style === 'italic' && ' i'}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CSS Snippet */}
        <div
          className="code-snippet tooltip-wrap"
          onClick={handleCopyFamily}
          title="Click to copy"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {cssSnippet}
          </span>
          {copied ? (
            <Check size={12} style={{ color: 'var(--jade)', flexShrink: 0 }} />
          ) : (
            <Copy size={12} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          )}
          <span className="tooltip">Copy CSS</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          {font.downloadUrl && (
            <a
              href={font.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                background: 'rgba(91,228,154,0.1)',
                border: '1px solid rgba(91,228,154,0.2)',
                borderRadius: '6px',
                color: 'var(--jade)',
                fontSize: '0.72rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-syne)',
                transition: 'background 0.2s, border-color 0.2s',
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(91,228,154,0.18)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(91,228,154,0.1)';
              }}
            >
              <Download size={12} />
              Download
            </a>
          )}

          {font.purchaseUrl && (
            <a
              href={font.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                background: 'rgba(237,187,95,0.1)',
                border: '1px solid rgba(237,187,95,0.2)',
                borderRadius: '6px',
                color: 'var(--gold)',
                fontSize: '0.72rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-syne)',
                transition: 'background 0.2s',
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(237,187,95,0.18)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(237,187,95,0.1)';
              }}
            >
              <ShoppingCart size={12} />
              Purchase
            </a>
          )}

          <button
            onClick={handleCopyCss}
            className="tooltip-wrap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '7px 14px',
              background: copiedCss ? 'rgba(91,228,154,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copiedCss ? 'rgba(91,228,154,0.2)' : 'var(--border)'}`,
              borderRadius: '6px',
              color: copiedCss ? 'var(--jade)' : 'var(--muted)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-syne)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {copiedCss ? <Check size={12} /> : <Code size={12} />}
            {font.source === 'google' ? <ExternalLink size={10} /> : null}
            <span className="tooltip">Copy @import + CSS</span>
          </button>
        </div>
      </div>
    </article>
  );
}
