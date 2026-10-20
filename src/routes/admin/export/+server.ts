import { interestLabel, interests, type Interest } from '#lib/forms.ts';
import { getLeads } from '#lib/server/db.ts';
import type { RequestHandler } from './$types';

/** Quotes a cell, and defuses values Excel would run as a formula */
function cell(value: unknown) {
	let text = value == null ? '' : String(value);
	if (/^[=+\-@]/.test(text)) text = `'${text}`;
	return /[",\n\r;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

const date = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Africa/Douala' });

// Access is checked in hooks.server.ts
export const GET: RequestHandler = async ({ url }) => {
	const leads = await getLeads(url.searchParams.get('type'));

	const header = ['id', 'type', 'nom', 'email', 'societe', 'telephone', 'pays', 'interet', 'message', 'langue', 'langue_pdf', 'ip', 'date', 'telechargements'];
	const rows = leads.map((lead) =>
		[
			lead.id,
			lead.type,
			lead.name,
			lead.email,
			lead.company,
			lead.phone,
			lead.country,
			lead.interest && interests.includes(lead.interest as Interest) ? interestLabel(lead.interest as Interest, 'fr') : lead.interest,
			lead.message,
			lead.lang,
			lead.doc_lang,
			lead.ip,
			date.format(lead.created_at),
			lead.download_count
		]
			.map(cell)
			.join(',')
	);

	// The BOM makes Excel read the file as UTF-8
	return new Response('﻿' + [header.join(','), ...rows].join('\r\n'), {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': 'attachment; filename="leads-mobilewallet.csv"',
			'cache-control': 'no-store'
		}
	});
};
