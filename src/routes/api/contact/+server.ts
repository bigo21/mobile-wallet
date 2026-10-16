import { json } from '@sveltejs/kit';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import * as v from 'valibot';
import { contactSchema, interestLabel, requestExtras } from '#lib/forms.ts';
import { saveLead } from '#lib/server/db.ts';
import { emailContext, fromAddress, resend, sentAt, supportAddress } from '#lib/server/email.ts';
import { contactNotification } from '#lib/server/email-templates.ts';
import { rateLimited } from '#lib/server/rate-limit.ts';
import type { RequestHandler } from './$types';

/** The contact sidebar: emails the enquiry to support, with Reply-To set to the visitor */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const body: unknown = await request.json().catch(() => null);
	const extras = v.safeParse(requestExtras, body);
	if (!extras.success) return json({ ok: false, error: 'invalid' }, { status: 400 });

	// A filled honeypot means a bot: pretend it worked and send nothing
	if (extras.output.website) return json({ ok: true });
	if (rateLimited(`contact:${getClientAddress()}`)) return json({ ok: false, error: 'rate_limited' }, { status: 429 });

	const result = v.safeParse(contactSchema(), body);
	if (!result.success) return json({ ok: false, error: 'invalid' }, { status: 400 });

	const { name, email, company, interest, message } = result.output;
	const phone = result.output.phone ? (parsePhoneNumberFromString(result.output.phone)?.formatInternational() ?? result.output.phone) : undefined;

	// Saved before sending, so the lead is kept even if the email fails
	await saveLead({
		type: 'contact',
		name,
		email,
		company,
		phone,
		interest,
		message,
		lang: extras.output.locale ?? 'en',
		ip: getClientAddress(),
		userAgent: request.headers.get('user-agent')
	});

	const mail = contactNotification({
		...emailContext('Sent automatically from the contact form on mobilewalletinc.com.'),
		name,
		email,
		company,
		phone,
		interest: interestLabel(interest, 'en'),
		message,
		siteLanguage: extras.output.locale === 'fr' ? 'French' : 'English',
		sentAt: sentAt()
	});

	try {
		const { error } = await resend().emails.send({ from: fromAddress(), to: supportAddress(), replyTo: email, ...mail });
		if (error) throw error;
	} catch (error) {
		console.error('[contact] email not sent', error);
		return json({ ok: false, error: 'send_failed' }, { status: 502 });
	}

	return json({ ok: true });
};
