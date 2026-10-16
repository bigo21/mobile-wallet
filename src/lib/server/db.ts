import { DATABASE_URL } from '$app/env/private';
import postgres from 'postgres';

// Leads live in the private "mobilewallet" schema of the Supabase project (not exposed to
// its Data API), reached over a direct Postgres connection — see supabase/migrations/.

let client: postgres.Sql | undefined;
function sql() {
	if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
	// The transaction pooler doesn't support prepared statements
	return (client ??= postgres(DATABASE_URL, { prepare: false }));
}

export const leadTypes = ['contact', 'presentation', 'documentation'] as const;
export type LeadType = (typeof leadTypes)[number];

export type LeadInput = {
	type: LeadType;
	name: string;
	email: string;
	company?: string;
	phone?: string;
	interest?: string;
	message?: string;
	/** Language of the site when the form was sent */
	lang: string;
	/** Language of the PDF that was asked for (presentation) */
	docLang?: string;
	ip?: string;
	userAgent?: string | null;
};

/** Saves a lead. Best effort: a database problem must never stop the emails from going out */
export async function saveLead(lead: LeadInput) {
	if (!DATABASE_URL) return;
	try {
		await sql()`
			insert into mobilewallet.leads
				(type, name, email, company, phone, interest, message, lang, doc_lang, ip, user_agent)
			values
				(${lead.type}, ${lead.name}, ${lead.email}, ${lead.company || null}, ${lead.phone || null},
				 ${lead.interest ?? null}, ${lead.message || null}, ${lead.lang}, ${lead.docLang ?? null},
				 ${lead.ip ?? null}, ${lead.userAgent ?? null})`;
	} catch (error) {
		console.error('[db] lead not saved', error);
	}
}

export type LeadRow = {
	id: number;
	type: LeadType;
	name: string;
	email: string;
	company: string | null;
	country: string | null;
	phone: string | null;
	interest: string | null;
	message: string | null;
	lang: string;
	doc_lang: string | null;
	ip: string | null;
	download_count: number;
	created_at: Date;
};

export const isLeadType = (type: string | null): type is LeadType => leadTypes.includes(type as LeadType);

/** Leads, newest first — all of them or one type */
export function getLeads(type: string | null) {
	const db = sql();
	return db<LeadRow[]>`
		select id, type, name, email, company, country, phone, interest, message, lang, doc_lang, ip,
		       download_count, created_at
		from mobilewallet.leads
		${isLeadType(type) ? db`where type = ${type}` : db``}
		order by created_at desc
		limit 2000`;
}

/** Number of leads per type */
export async function getLeadCounts() {
	const rows = await sql()<{ type: LeadType; n: number }[]>`
		select type, count(*)::int as n from mobilewallet.leads group by type`;
	const counts: Record<LeadType, number> = { contact: 0, presentation: 0, documentation: 0 };
	for (const { type, n } of rows) counts[type] = n;
	return counts;
}
