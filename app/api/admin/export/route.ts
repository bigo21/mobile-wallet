import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAuthed, ADMIN_COOKIE } from '@/lib/adminAuth';
import { getLeads } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Protège une cellule CSV contre l'injection de formules. */
function csvCell(v: unknown): string {
  let s = v == null ? '' : String(v);
  if (s && '=+-@'.includes(s[0])) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

/** Formate une date en "YYYY-MM-DD HH:MM:SS" pour le CSV. */
function csvDate(v: unknown): string {
  if (!v) return '';
  const d = new Date(v as string | number | Date);
  if (Number.isNaN(d.getTime())) return String(v);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return new NextResponse('Accès refusé.', { status: 401 });
  }

  const type = new URL(req.url).searchParams.get('type') ?? '';
  const leads = await getLeads(type);

  const header = ['id', 'type', 'nom', 'email', 'pays', 'telephone', 'message', 'langue', 'langue_doc', 'ip', 'date', 'telechargements', 'dernier_telechargement'];
  const lines = [header.join(',')];
  for (const l of leads) {
    lines.push([
      l.id, l.type, csvCell(l.name), csvCell(l.email), csvCell(l.country), csvCell(l.phone),
      csvCell(l.message), l.lang, csvCell(l.doc_lang), csvCell(l.ip), csvDate(l.created_at),
      l.download_count, csvDate(l.downloaded_at),
    ].join(','));
  }
  const csv = '﻿' + lines.join('\r\n'); // BOM UTF-8 pour Excel

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads-mobilewallet.csv"',
    },
  });
}
