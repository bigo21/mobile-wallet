import type { Handle } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '#lib/paraglide/server.js';

// Resolves the locale for each request (so messages render in it) and sets <html lang>.
// API routes skip it: they're not localized, and its redirects would break their POSTs.
export const handle: Handle = ({ event, resolve }) =>
	event.url.pathname.startsWith('/api/')
		? resolve(event)
		: paraglideMiddleware(event.request, ({ locale }) =>
				resolve(event, {
					transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
				})
			);
