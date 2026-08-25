import { createHash, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'mw_admin';

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}

/** Jeton stocké dans le cookie de session (dérivé du mot de passe, non réversible). */
export function adminToken(): string {
  return createHash('sha256').update('mw-admin|' + adminPassword()).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Vérifie le mot de passe saisi (comparaison à temps constant). */
export function verifyPassword(input: string): boolean {
  const p = adminPassword();
  return p.length > 0 && safeEqual(input, p);
}

/** Vérifie la validité du cookie de session. */
export function isAuthed(cookieValue: string | undefined): boolean {
  if (!adminPassword() || !cookieValue) return false;
  return safeEqual(cookieValue, adminToken());
}
