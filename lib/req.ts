import type { NextRequest } from 'next/server';

/** IP du client (gère les proxys/Vercel). */
export function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '';
}

/** Origine publique de la requête (protocole + hôte), pour construire des URLs absolues. */
export function getOrigin(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('host') ?? '';
  return `${proto}://${host}`;
}
