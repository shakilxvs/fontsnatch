import type { Metadata } from 'next';
import { Syne, Epilogue, Fira_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const firaMono = Fira_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FontSnatch — Font Thief',
  description:
    'Drop a URL. Identify every font used on any website — name, foundry, license, download link.',
  openGraph: {
    title: 'FontSnatch — Font Thief',
    description: 'Identify every font used on any website in seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FontSnatch — Font Thief',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${epilogue.variable} ${firaMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
