import postgres from 'postgres';

// Client Postgres (Supabase, schéma privé "mobilewallet") via le transaction pooler.
// Singleton réutilisé entre invocations serverless (et en dev pour éviter les fuites).
const globalForDb = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };

const sql =
  globalForDb._sql ??
  postgres(process.env.DATABASE_URL as string, { prepare: false });

if (process.env.NODE_ENV !== 'production') globalForDb._sql = sql;

export default sql;

export type LeadInput = {
  type: 'contact' | 'presentation' | 'documentation';
  name: string;
  email: string;
  country?: string | null;
  phone?: string | null;
  message?: string | null;
  lang?: string;
  doc_lang?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  download_token?: string | null;
};

/** Enregistre un lead. Best-effort : retourne null en cas d'échec (n'interrompt pas l'envoi des emails). */
export async function saveLead(d: LeadInput): Promise<number | null> {
  try {
    const rows = await sql<{ id: number }[]>`
      insert into mobilewallet.leads
        (type, name, email, country, phone, message, lang, doc_lang, ip, user_agent, download_token)
      values
        (${d.type}, ${d.name}, ${d.email}, ${d.country ?? null}, ${d.phone ?? null},
         ${d.message ?? null}, ${d.lang ?? 'fr'}, ${d.doc_lang ?? null}, ${d.ip ?? null},
         ${d.user_agent ?? null}, ${d.download_token ?? null})
      returning id`;
    return rows[0]?.id ?? null;
  } catch (e) {
    console.error('saveLead error:', e);
    return null;
  }
}

/** Enregistre un téléchargement (compteur sur le lead + ligne de détail). */
export async function trackDownload(
  token: string,
  ip: string | null,
  ua: string | null,
): Promise<void> {
  const leads = await sql<{ id: number }[]>`
    select id from mobilewallet.leads where download_token = ${token} limit 1`;
  const lead = leads[0];
  if (!lead) return;
  await sql`update mobilewallet.leads
              set download_count = download_count + 1, downloaded_at = now()
            where id = ${lead.id}`;
  await sql`insert into mobilewallet.downloads (lead_id, ip, user_agent)
            values (${lead.id}, ${ip}, ${ua})`;
}
