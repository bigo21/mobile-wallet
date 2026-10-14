import { documents, pdfBuffer } from '#lib/server/documents.ts';
import type { RequestHandler } from './$types';

// Keeps the download links in emails sent by the previous website working
// (/api/download?t=<token>&l=fr|en). The token was only used for tracking.
export const GET: RequestHandler = ({ url }) => {
	const language = url.searchParams.get('l') === 'en' ? 'en' : 'fr';
	return new Response(new Uint8Array(pdfBuffer(language)), {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `inline; filename="${documents[language].filename}"`,
			'cache-control': 'private, max-age=3600',
			'x-robots-tag': 'noindex'
		}
	});
};
