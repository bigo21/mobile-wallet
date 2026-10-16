import { fail, redirect } from '@sveltejs/kit';
import { adminCookie, adminToken, checkPassword, isAdmin } from '#lib/server/admin-auth.ts';
import { rateLimited } from '#lib/server/rate-limit.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (isAdmin(cookies.get(adminCookie))) redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		if (rateLimited(`admin-login:${getClientAddress()}`, { max: 10 })) return fail(429, { error: 'Trop de tentatives, réessayez dans quelques minutes.' });

		const password = String((await request.formData()).get('password') ?? '');
		if (!checkPassword(password)) return fail(401, { error: 'Mot de passe incorrect.' });

		cookies.set(adminCookie, adminToken(), { path: '/admin', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });
		redirect(303, '/admin');
	}
};
