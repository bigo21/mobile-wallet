import { json } from '@sveltejs/kit';
import * as v from 'valibot';
import { presentationSchema, requestExtras } from '#lib/forms.ts';
import { m } from '#lib/paraglide/messages.js';
import { saveLead } from '#lib/server/db.ts';
import { emailContext, fromAddress, resend, sentAt, supportAddress } from '#lib/server/email.ts';
import { leadNotification, presentationEmail } from '#lib/server/email-templates.ts';
import { rateLimited } from '#lib/server/rate-limit.ts';
import { documents, pdfBuffer } from '#lib/server/documents.ts';
import type { RequestHandler } from './$types';

/** The presentation modal: emails the PDF to the visitor and tells support about the lead */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const body: unknown = await request.json().catch(() => null);
	const extras = v.safeParse(requestExtras, body);
	if (!extras.success) return json({ ok: false, error: 'invalid' }, { status: 400 });

	// Never report success for a request that isn't sent (see the contact route)
	if (extras.output.website) {
		console.warn('[presentation] honeypot filled, request rejected');
		return json({ ok: false, error: 'rejected' }, { status: 400 });
	}
	// Stricter than the contact form: this one sends mail to the address it is given
	if (rateLimited(`presentation:${getClientAddress()}`, { max: 3 })) return json({ ok: false, error: 'rate_limited' }, { status: 429 });

	const result = v.safeParse(presentationSchema(), body);
	if (!result.success) return json({ ok: false, error: 'invalid' }, { status: 400 });

	const { name, email, language } = result.output;

	// Saved before sending, so the lead is kept even if the email fails
	await saveLead({
		type: 'presentation',
		name,
		email,
		lang: extras.output.locale ?? 'en',
		docLang: language,
		ip: getClientAddress(),
		userAgent: request.headers.get('user-agent')
	});

	const locale = { locale: language };
	const document = documents[language];
	const pdf = pdfBuffer(language);
	const size = `${Math.max(1, Math.round(pdf.length / 1024))} KB`;
	const pages = String(document.pages);

	const context = emailContext(m.email_reason({}, locale), language);
	const visitorEmail = presentationEmail({
		...context,
		lang: language,
		filename: document.filename,
		meta: m.email_attachment_meta({ pages, size }, locale),
		ctaHref: `mailto:${supportAddress()}?subject=${encodeURIComponent(m.email_cta_subject({}, locale))}`,
		copy: {
			subject: m.email_presentation_subject({}, locale),
			preheader: m.email_presentation_preheader({ pages }, locale),
			eyebrow: m.email_presentation_eyebrow({}, locale),
			title: m.email_presentation_title({}, locale),
			greeting: m.email_presentation_greeting({ name: name.split(/\s+/)[0] }, locale),
			intro: m.email_presentation_intro({}, locale),
			attachmentLabel: m.email_attachment_label({}, locale),
			insideTitle: m.email_inside_title({}, locale),
			inside: [m.email_inside_1({}, locale), m.email_inside_2({}, locale), m.email_inside_3({}, locale), m.email_inside_4({}, locale)],
			stats: [
				{ value: '24M+', label: m.email_stat_accounts({}, locale) },
				{ value: m.email_stat_payback_value({}, locale), label: m.email_stat_payback({}, locale) },
				{ value: '24/7', label: m.email_stat_support({}, locale) }
			],
			ctaIntro: m.email_cta_intro({}, locale),
			cta: m.email_cta({}, locale),
			help: m.email_presentation_help({}, locale),
			signoff: m.email_signoff({}, locale),
			team: m.email_signature({}, locale)
		}
	});

	try {
		const mail = resend();
		const { error } = await mail.emails.send({
			from: fromAddress(),
			to: email,
			replyTo: supportAddress(),
			...visitorEmail,
			attachments: [{ filename: document.filename, content: pdf, contentType: 'application/pdf' }]
		});
		if (error) throw error;

		// The lead is useful but not essential — don't fail the visitor's request over it
		const lead = leadNotification({
			...emailContext('Sent automatically when someone requests the presentation on mobilewalletinc.com.'),
			name,
			email,
			language: language === 'fr' ? 'French' : 'English',
			sentAt: sentAt()
		});
		const notify = await mail.emails.send({ from: fromAddress(), to: supportAddress(), replyTo: email, ...lead });
		if (notify.error) console.error('[presentation] lead notification not sent', notify.error);
	} catch (error) {
		console.error('[presentation] email not sent', error);
		return json({ ok: false, error: 'send_failed' }, { status: 502 });
	}

	return json({ ok: true });
};
