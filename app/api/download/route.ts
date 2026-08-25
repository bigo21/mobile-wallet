import { NextRequest, NextResponse } from 'next/server';
import { trackDownload } from '@/lib/db';
import { documentPdf, pickLang } from '@/lib/config';
import { clientIp, getOrigin } from '@/lib/req';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t') ?? '';
  const lang = pickLang(url.searchParams.get('l'));

  // Tracking best-effort : ne bloque jamais l'accès au document.
  if (/^[a-f0-9]{8,64}$/.test(token)) {
    try {
      await trackDownload(token, clientIp(req), req.headers.get('user-agent'));
    } catch (e) {
      console.error('trackDownload error:', e);
    }
  }

  const pdf = documentPdf[lang];
  if (!pdf) return new NextResponse('Document indisponible.', { status: 404 });

  return NextResponse.redirect(`${getOrigin(req)}${pdf}`, 302);
}
