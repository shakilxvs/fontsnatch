'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ArrowRight,
  AlertTriangle,
  Zap,
  Scan,
  X,
  Filter,
  ChevronDown,
  Layers,
} from 'lucide-react';
import FontCard from '@/components/FontCard';
import type { FontResult } from '@/lib/types';

// ─── Example sites to try ────────────────────────────────────────────────────
const EXAMPLES = [
  'stripe.com',
  'linear.app',
  'vercel.com',
  'notion.so',
  'figma.com',
  'tailwindcss.com',
  'loom.com',
  'framer.com',
];

type FilterSource = 'all' | 'google' | 'adobe' | 'bunny' | 'custom' | 'system';

// ─── Loading state component ─────────────────────────────────────────────────
function ScanningState({ url }: { url: string }) {
  const [step, setStep] = useState(0);
  const steps = [
    'Fetching page HTML…',
    'Detecting Google Fonts…',
    'Parsing stylesheet links…',
    'Extracting @font-face rules…',
    'Cross-referencing font database…',
    'Building results…',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="animate-fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        padding: '48px 24px',
      }}
    >
      {/* Animated scanner */}
      <div style={{ position: 'relative', width: '200px', height: '130px' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid var(--border-bright)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--surface)',
          }}
        >
          {/* Faux text lines */}
          {[60, 40, 80, 35, 70, 45].map((w, i) => (
            <div
              key={i}
              className="skeleton"
              style={{
                height: '8px',
                width: `${w}%`,
                borderRadius: '4px',
                margin: `${i === 0 ? 20 : 8}px 16px 0`,
              }}
            />
          ))}
          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--violet), transparent)',
              animation: 'scanMove 1.2s ease-in-out infinite',
              boxShadow: '0 0 12px var(--violet)',
            }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--violet)',
            letterSpacing: '0.04em',
            marginBottom: '8px',
          }}
        >
          {steps[step]}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          scanning{' '}
          <span style={{ color: 'var(--ivory-dim)' }}>
            {url.replace(/^https?:\/\//, '').split('/')[0]}
          </span>
        </p>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i <= step ? 'var(--violet)' : 'var(--surface-3)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty / zero results state ──────────────────────────────────────────────
function EmptyState({ url }: { url: string }) {
  return (
    <div
      className="animate-fade-up"
      style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--muted)' }}
    >
      <Layers size={40} style={{ margin: '0 auto 16px', color: 'var(--border-bright)' }} />
      <p style={{ fontFamily: 'var(--font-syne)', fontSize: '1rem', color: 'var(--ivory-dim)', marginBottom: '8px' }}>
        No fonts detected
      </p>
      <p style={{ fontSize: '0.8rem' }}>
        {url.replace(/^https?:\/\//, '')} may block external requests or use only system fonts.
      </p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fonts, setFonts] = useState<FontResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedUrl, setScannedUrl] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [scanTime, setScanTime] = useState(0);
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [showFilter, setShowFilter] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const detect = async (targetUrl?: string) => {
    const finalUrl = (targetUrl ?? url).trim();
    if (!finalUrl) return;
    setLoading(true);
    setError(null);
    setFonts(null);
    setFilterSource('all');

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setFonts(data.fonts);
        setScannedUrl(data.url);
        setPageTitle(data.pageTitle ?? '');
        setScanTime(data.scanTime);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') detect();
  };

  const handleExample = (site: string) => {
    setUrl(site);
    detect(site);
  };

  const clearResults = () => {
    setFonts(null);
    setError(null);
    setUrl('');
    inputRef.current?.focus();
  };

  const filteredFonts =
    fonts === null
      ? null
      : filterSource === 'all'
      ? fonts
      : fonts.filter((f) => f.source === filterSource);

  const sourceGroups =
    fonts === null
      ? {}
      : fonts.reduce<Record<string, number>>((acc, f) => {
          acc[f.source] = (acc[f.source] ?? 0) + 1;
          return acc;
        }, {});

  const hasResults = fonts !== null && fonts.length > 0;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="dot-grid"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: hasResults ? '42vh' : '100vh',
          padding: '80px 24px 60px',
          transition: 'min-height 0.6s ease',
        }}
      >
        <div className="hero-glow" />

        {/* Wordmark */}
        <div
          className="animate-fade-up"
          style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginBottom: '12px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                background: 'var(--violet)',
                borderRadius: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--violet-glow)',
              }}
            >
              <Scan size={16} color="white" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--ivory-dim)',
              }}
            >
              FontSnatch
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--ivory)',
              marginBottom: '16px',
            }}
          >
            Drop a URL.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--violet) 0%, var(--gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Steal the Fonts.
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-epilogue)',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'var(--muted)',
              maxWidth: '440px',
              margin: '0 auto 36px',
              lineHeight: 1.55,
            }}
          >
            Identify every typeface on any website — name, foundry, license, and download link.
            No dev tools required.
          </p>
        </div>

        {/* Search bar */}
        <div
          className="animate-fade-up"
          style={{
            animationDelay: '0.1s',
            width: '100%',
            maxWidth: '640px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border-bright)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 0 0 0 var(--violet-glow)',
              transition: 'box-shadow 0.3s, border-color 0.3s',
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 3px var(--violet-glow)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,124,247,0.4)';
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 var(--violet-glow)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-bright)';
            }}
          >
            <div style={{ padding: '0 16px', flexShrink: 0 }}>
              <Globe size={18} color="var(--muted)" />
            </div>

            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://stripe.com"
              disabled={loading}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--ivory)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                padding: '18px 0',
                width: '100%',
              }}
            />

            {url && !loading && (
              <button
                onClick={() => setUrl('')}
                style={{
                  padding: '0 10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}

            <button
              onClick={() => detect()}
              disabled={loading || !url.trim()}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '18px 24px',
                borderRadius: 0,
                fontSize: '0.85rem',
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Scanning
                </>
              ) : (
                <>
                  Detect Fonts
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          {/* Example pills */}
          {!hasResults && !loading && (
            <div
              className="animate-fade-up"
              style={{
                animationDelay: '0.2s',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '16px',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Zap size={10} />
                Try:
              </span>
              {EXAMPLES.map((site) => (
                <button
                  key={site}
                  onClick={() => handleExample(site)}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    color: 'var(--ivory-dim)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(139,124,247,0.1)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(139,124,247,0.3)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--violet)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--ivory-dim)';
                  }}
                >
                  {site}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Loading state ─────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ padding: '0 24px 80px' }}>
          <ScanningState url={url} />
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && !loading && (
        <div
          className="animate-fade-up"
          style={{
            maxWidth: '640px',
            margin: '0 auto 80px',
            padding: '16px 20px',
            background: 'rgba(240,108,108,0.08)',
            border: '1px solid rgba(240,108,108,0.2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            color: 'var(--coral)',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: 600, marginBottom: '2px', fontFamily: 'var(--font-syne)' }}>
              Detection failed
            </p>
            <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>{error}</p>
          </div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {fonts !== null && !loading && (
        <section
          ref={resultsRef}
          style={{ padding: '0 24px 100px', maxWidth: '1200px', margin: '0 auto' }}
        >
          {/* Results header */}
          <div
            className="animate-fade-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '28px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Results
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--ivory)',
                }}
              >
                <span style={{ color: 'var(--violet)' }}>{fonts.length}</span> font
                {fonts.length !== 1 ? 's' : ''} detected
                {pageTitle && (
                  <span
                    style={{
                      fontWeight: 400,
                      color: 'var(--muted)',
                      fontSize: '0.9rem',
                      marginLeft: '10px',
                    }}
                  >
                    on {pageTitle}
                  </span>
                )}
              </h2>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--muted)',
                  marginTop: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {scannedUrl.replace(/^https?:\/\//, '')} · {(scanTime / 1000).toFixed(1)}s
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* Filter */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-bright)',
                    borderRadius: '8px',
                    color: 'var(--ivory-dim)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-syne)',
                    transition: 'background 0.2s',
                  }}
                >
                  <Filter size={12} />
                  {filterSource === 'all' ? 'All sources' : filterSource}
                  <ChevronDown
                    size={12}
                    style={{ transition: 'transform 0.2s', transform: showFilter ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {showFilter && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border-bright)',
                      borderRadius: '10px',
                      padding: '6px',
                      zIndex: 1000,
                      minWidth: '160px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      animation: 'fadeIn 0.15s ease-out',
                    }}
                  >
                    {(['all', ...Object.keys(sourceGroups)] as FilterSource[]).map((src) => (
                      <button
                        key={src}
                        onClick={() => { setFilterSource(src); setShowFilter(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '8px 12px',
                          background: filterSource === src ? 'rgba(139,124,247,0.15)' : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: filterSource === src ? 'var(--violet)' : 'var(--ivory-dim)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-epilogue)',
                          textAlign: 'left',
                          textTransform: 'capitalize',
                          transition: 'background 0.15s',
                        }}
                      >
                        <span>{src === 'all' ? 'All sources' : src}</span>
                        {src !== 'all' && sourceGroups[src] !== undefined && (
                          <span style={{ opacity: 0.5, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                            {sourceGroups[src]}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={clearResults}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-syne)',
                  transition: 'color 0.2s',
                }}
              >
                <X size={12} />
                Clear
              </button>
            </div>
          </div>

          {/* Source summary pills */}
          {Object.keys(sourceGroups).length > 1 && (
            <div
              className="animate-fade-up"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '24px',
                animationDelay: '0.05s',
              }}
            >
              {Object.entries(sourceGroups).map(([src, count]) => (
                <div
                  key={src}
                  style={{
                    padding: '4px 12px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    fontSize: '0.72rem',
                    color: 'var(--ivory-dim)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{src}</span>
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontSize: '0.65rem',
                    }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Font Grid */}
          {filteredFonts && filteredFonts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredFonts.map((font) => (
                <FontCard key={font.id} font={font} />
              ))}
            </div>
          ) : (
            <EmptyState url={scannedUrl} />
          )}
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid var(--border)',
          color: 'var(--muted)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        FontSnatch · Open source · <a href="https://shakilxvs.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>@shakilxvs</a>
      </footer>
    </div>
  );
}
