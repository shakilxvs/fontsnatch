export interface FontVariant {
  weight: string;
  style: 'normal' | 'italic' | 'oblique';
}

export type FontCategory =
  | 'sans-serif'
  | 'serif'
  | 'monospace'
  | 'display'
  | 'handwriting'
  | 'unknown';

export type FontSource = 'google' | 'adobe' | 'bunny' | 'custom' | 'system';

export type FontLicense = 'open-source' | 'paid' | 'system' | 'unknown';

export interface FontResult {
  id: string;
  name: string;
  cssFamily: string;
  category: FontCategory;
  source: FontSource;
  license: FontLicense;
  foundry?: string;
  description?: string;
  variants: FontVariant[];
  downloadUrl?: string;
  purchaseUrl?: string;
  googleFontsUrl?: string; // CSS import URL for preview loading
}

export interface DetectionResult {
  url: string;
  fonts: FontResult[];
  scanTime: number;
  pageTitle?: string;
  fontsCount: number;
}
