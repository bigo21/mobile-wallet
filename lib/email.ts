import { Resend } from 'resend';
import { mailConfig, type Lang } from './config';

const resend = new Resend(process.env.RESEND_API_KEY);

/** Échappement HTML pour insérer des données utilisateur en toute sécurité. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Gabarit d'email brandé MobileWallet (bilingue). */
export function emailTemplate(
  title: string,
  contentHtml: string,
  preheader: string,
  lang: Lang,
): string {
  const year = new Date().getFullYear();
  const tagline =
    lang === 'en'
      ? 'Cash-in / cash-out infrastructure in Africa.'
      : 'Infrastructure cash-in / cash-out en Afrique.';
  const autoNote =
    lang === 'en'
      ? 'This email was generated automatically, please do not reply directly.'
      : 'Cet email est généré automatiquement, merci de ne pas y répondre directement.';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0D0D0D,#2D1B0E);padding:28px 32px;">
          <span style="color:#F9A825;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Mobile<span style="color:#ffffff;">Wallet</span></span>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 20px;font-size:20px;line-height:1.4;color:#1a1a1a;">${title}</h1>
          ${contentHtml}
        </td></tr>
        <tr><td style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #eeeeee;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#999999;">© ${year} MobileWallet Incorporated — ${tagline}<br>${autoNote}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Bloc « bouton de téléchargement + lien de secours » (bilingue). */
export function downloadBlock(linkUrl: string, lang: Lang): string {
  const e = esc(linkUrl);
  const btn = lang === 'en' ? 'Download the document' : 'Télécharger le document';
  const fallback =
    lang === 'en'
      ? 'If the button does not work, copy this link into your browser:'
      : 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :';
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;"><tr><td style="border-radius:8px;background-color:#F9A825;">
      <a href="${e}" style="display:inline-block;padding:14px 28px;color:#000000;font-weight:bold;text-decoration:none;border-radius:8px;">${btn}</a>
    </td></tr></table>
    <p style="margin:0 0 20px;font-size:12px;line-height:1.6;color:#888;">${fallback}<br><a href="${e}" style="color:#F9A825;word-break:break-all;">${e}</a></p>`;
}

export type MailOptions = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Envoie un email via Resend. Lève en cas d'erreur (le champ error de Resend est remonté). */
export async function sendMail(opts: MailOptions): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: `${mailConfig.fromName} <${mailConfig.fromEmail}>`,
    to: opts.toName ? `${opts.toName} <${opts.to}>` : opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });
  if (error) {
    throw new Error(typeof error === 'string' ? error : (error.message ?? 'Resend error'));
  }
  void data;
}
