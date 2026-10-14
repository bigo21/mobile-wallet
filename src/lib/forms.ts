// Form schemas shared by the browser (instant feedback) and the API routes (the real check)
import { isValidPhoneNumber } from 'libphonenumber-js';
import * as v from 'valibot';
import { m } from '#lib/paraglide/messages.js';
import { locales } from '#lib/paraglide/runtime.js';

type Locale = (typeof locales)[number];

export const interests = ['franchise', 'bring_atm', 'saas', 'partner', 'other'] as const;
export type Interest = (typeof interests)[number];

export const interestLabel = (interest: Interest, locale?: Locale) => {
	const options = locale ? { locale } : {};
	switch (interest) {
		case 'franchise':
			return m.footer_link_franchise({}, options);
		case 'bring_atm':
			return m.footer_link_bring_atm({}, options);
		case 'saas':
			return m.footer_link_saas({}, options);
		case 'partner':
			return m.footer_link_partner({}, options);
		case 'other':
			return m.contact_interest_other({}, options);
	}
};

const tooLong = (max: number) => m.contact_error_too_long({ max: String(max) });
const name = () => v.pipe(v.string(), v.trim(), v.minLength(2, m.contact_error_name()), v.maxLength(100, tooLong(100)));
const email = () => v.pipe(v.string(), v.trim(), v.nonEmpty(m.contact_error_email()), v.email(m.contact_error_email()), v.maxLength(254, tooLong(254)));

// Built on demand so the error messages use the visitor's current language
export const contactSchema = () =>
	v.object({
		name: name(),
		email: email(),
		company: v.pipe(v.string(), v.trim(), v.maxLength(100, tooLong(100))),
		// Optional; PhoneInput hands over the number in E.164 format (+237671234567)
		phone: v.pipe(
			v.string(),
			v.check((value) => value === '' || isValidPhoneNumber(value), m.contact_error_phone())
		),
		interest: v.picklist(interests),
		message: v.pipe(v.string(), v.trim(), v.minLength(10, m.contact_error_message()), v.maxLength(1500, tooLong(1500)))
	});

export const presentationSchema = () =>
	v.object({
		name: name(),
		email: email(),
		language: v.picklist(locales)
	});

/** What the API routes accept on top of the form fields */
export const requestExtras = v.object({
	locale: v.optional(v.picklist(locales)),
	// Honeypot: hidden from people, so anything in it came from a bot
	website: v.optional(v.string())
});

/** One message per field — the first rule it fails */
export function fieldErrors<T extends v.GenericSchema>(result: v.SafeParseResult<T>): Record<string, string> {
	if (result.success) return {};
	const nested = (v.flatten<T>(result.issues).nested ?? {}) as Record<string, string[] | undefined>;
	return Object.fromEntries(Object.entries(nested).map(([field, messages]) => [field, messages?.[0] ?? '']));
}
