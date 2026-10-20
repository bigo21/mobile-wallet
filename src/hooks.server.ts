import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '#lib/paraglide/server.js';
import { adminCookie, isAdmin } from '#lib/server/admin-auth.ts';

const isAdminPath = (pathname: string) => pathname === '/admin' || pathname.startsWith('/admin/');

// Every /admin page, form action and export is locked here, except the login page.
// The admin is in French only.
const admin: Handle = ({ event, resolve }) => {
	if (event.url.pathname !== '/admin/login' && !isAdmin(event.cookies.get(adminCookie))) redirect(303, '/admin/login');
	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', 'fr') });
};

// Resolves the locale for each request (so messages render in it) and sets <html lang>.
// API routes skip it: they're not localized, and its redirects would break their POSTs.
// So does the admin, for the same reasons.
export const handle: Handle = ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/')) return resolve(event);
	if (isAdminPath(event.url.pathname)) return admin({ event, resolve });
	return paraglideMiddleware(event.request, ({ locale }) =>
		resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		})
	);
};
