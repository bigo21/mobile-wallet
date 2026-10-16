import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

// Server-only settings, read from the environment (or .env locally) — see .env.example
export const variables = defineEnvVars({
	RESEND_API_KEY: {
		description: 'Resend API key used to send the contact and presentation emails',
		// Optional so the site still starts without it; the forms report an error until it is set
		schema: v.optional(v.string())
	},
	RESEND_FROM: {
		description: 'Sender of all emails — its domain must be verified in Resend',
		schema: v.optional(v.string(), 'MobileWallet <support@mobilewalletinc.com>')
	},
	SITE_URL: {
		description: 'Public address of the site, used for links and the logo in emails',
		schema: v.optional(v.pipe(v.string(), v.url()), 'https://mobilewalletinc.com')
	},
	CONTACT_TO: {
		description: 'Inbox that receives enquiries and presentation leads',
		schema: v.optional(v.pipe(v.string(), v.email()), 'support@mobilewalletinc.com')
	},
	DATABASE_URL: {
		description: 'Supabase Postgres (transaction pooler, port 6543) where leads are saved',
		// Optional: without it the forms still send their emails, leads just aren't saved
		schema: v.optional(v.string())
	},
	ADMIN_PASSWORD: {
		description: 'Password of the /admin leads page — the page stays locked while it is unset',
		schema: v.optional(v.string())
	}
});
