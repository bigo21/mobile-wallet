import { NextRequest, NextResponse } from 'next/server';
import { adminToken, verifyPassword, ADMIN_COOKIE } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let password = '';
  try {
    const body = await req.json();
    password = String(body.password ?? '');
  } catch {
    password = '';
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ success: false, error: 'Mot de passe incorrect.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
  return res;
}
