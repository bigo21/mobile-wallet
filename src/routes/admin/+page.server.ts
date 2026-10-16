import { redirect } from '@sveltejs/kit';
import { adminCookie } from '#lib/server/admin-auth.ts';
import { getLeadCounts, getLeads, isLeadType } from '#lib/server/db.ts';
import type { Actions, PageServerLoad } from './$types';

// Access is checked in hooks.server.ts
export const load: PageServerLoad = async ({ url }) => {
	const type = url.searchParams.get('type');
	try {
		const [leads, counts] = await Promise.all([getLeads(type), getLeadCounts()]);
		return { type: isLeadType(type) ? type : null, leads, counts, dbError: false };
	} catch (error) {
		console.error('[admin] leads not loaded', error);
		return { type: null, leads: [], counts: { contact: 0, presentation: 0, documentation: 0 }, dbError: true };
	}
};

export const actions: Actions = {
	logout: ({ cookies }) => {
		cookies.delete(adminCookie, { path: '/admin' });
		redirect(303, '/admin/login');
	}
};
