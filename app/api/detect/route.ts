import { NextRequest, NextResponse } from 'next/server';
import { detectFonts } from '@/lib/fontDetector';

export const maxDuration = 30; // seconds — Vercel hobby allows up to 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body.url as string)?.trim();

    if (!rawUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    let targetUrl = rawUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const start = Date.now();
    const { fonts, pageTitle } = await detectFonts(targetUrl);
    const scanTime = Date.now() - start;

    return NextResponse.json({
      url: targetUrl,
      fonts,
      fontsCount: fonts.length,
      scanTime,
      pageTitle,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    if (message.includes('abort') || message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out — the site took too long to respond.' },
        { status: 504 }
      );
    }

    if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Could not reach that URL — check it is publicly accessible.' },
        { status: 502 }
      );
    }

    console.error('[FontSnatch] Detection error:', message);
    return NextResponse.json(
      { error: `Detection failed: ${message}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
