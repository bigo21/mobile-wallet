// The presentation PDFs. Inlined into the server bundle: works on any host and keeps
// them off the public site. To update one, replace the file with the same name.
import presentationEn from '#lib/server/documents/Mobile Wallet - Introduction Deck (EN).pdf?inline';
import presentationFr from '#lib/server/documents/Mobile Wallet - Deck introductif (FR).pdf?inline';

export const documents = {
	en: { file: presentationEn, filename: 'MobileWallet-Introduction-Deck-EN.pdf', pages: 10 },
	fr: { file: presentationFr, filename: 'MobileWallet-Deck-Introductif-FR.pdf', pages: 10 }
};

export type DocumentLanguage = keyof typeof documents;

const cache = new Map<DocumentLanguage, Buffer>();
/** The import is a data URL ("data:application/pdf;base64,…"); decode it once */
export function pdfBuffer(language: DocumentLanguage) {
	let pdf = cache.get(language);
	if (!pdf) {
		const { file } = documents[language];
		pdf = Buffer.from(file.slice(file.indexOf(',') + 1), 'base64');
		cache.set(language, pdf);
	}
	return pdf;
}
