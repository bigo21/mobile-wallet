// Configuration partagée des emails et documents.

export const mailConfig = {
  fromEmail: process.env.MAIL_FROM_EMAIL || 'contact@mobilewalletinc.com',
  fromName: process.env.MAIL_FROM_NAME || 'MobileWallet Vitrine',
  notificationEmail: process.env.NOTIFICATION_EMAIL || 'yvan.tadie@mobilewalletinc.com',
};

// PDF servis par Vercel depuis public/documents/ (chemins relatifs).
export const documentPdf: Record<'fr' | 'en', string> = {
  fr: process.env.DOC_PDF_FR || '/documents/mobile-wallet-presentation-franchises-6fz9.pdf',
  en: process.env.DOC_PDF_EN || '/documents/mobile-wallet-franchise-presentation-usd-5e9f.pdf',
};

export type Lang = 'fr' | 'en';

export function pickLang(v: unknown): Lang {
  return v === 'en' ? 'en' : 'fr';
}
