import { fail, redirect } from '@sveltejs/kit';
import { adminCookie, adminToken, checkCredentials, isAdmin } from '#lib/server/admin-auth.ts';
import { rateLimited } from '#lib/server/rate-limit.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (isAdmin(cookies.get(adminCookie))) redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '');

		if (rateLimited(`admin-login:${getClientAddress()}`, { max: 10 }))
			return fail(429, { name, error: 'Trop de tentatives, réessayez dans quelques minutes.' });

		// One message for both fields: don't reveal which one was wrong
		if (!checkCredentials(name, String(data.get('password') ?? ''))) return fail(401, { name, error: 'Nom ou mot de passe incorrect.' });

		cookies.set(adminCookie, adminToken(), { path: '/admin', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
		redirect(303, '/admin');
	}
};
