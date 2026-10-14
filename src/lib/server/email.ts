import { CONTACT_TO, RESEND_API_KEY, RESEND_FROM, SITE_URL } from '$app/env/private';
import { Resend } from 'resend';
import { contact, socials } from '#lib/data/site.ts';
import { m } from '#lib/paraglide/messages.js';
import type { Footer } from './email-templates.ts';

/** Where enquiries and leads go */
export const supportAddress = () => CONTACT_TO;
/** The sender — its domain must be verified in Resend */
export const fromAddress = () => RESEND_FROM;

let client: Resend | undefined;
export function resend() {
	if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
	return (client ??= new Resend(RESEND_API_KEY));
}

/** Logo, links and footer shared by every email; images need absolute URLs in email */
export function emailContext(reason: string, locale: 'en' | 'fr' = 'en'): { logoUrl: string; siteUrl: string; footer: Footer } {
	const siteUrl = SITE_URL.replace(/\/$/, '');
	return {
		logoUrl: `${siteUrl}/assets/images/logo.png`,
		siteUrl,
		footer: {
			siteUrl,
			location: m.location_full({}, { locale }),
			email: contact().email,
			socials: socials.map(({ label, href }) => ({ label, href })),
			reason
		}
	};
}

/** e.g. "Sent 14 Oct 2026, 17:42 (Douala time)" */
export const sentAt = () =>
	`Sent ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Douala' }).format(new Date())} (Douala time)`;
