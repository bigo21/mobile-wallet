import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { saveLead } from '@/lib/db';
import { sendMail, emailTemplate, downloadBlock, esc } from '@/lib/email';
import { mailConfig, pickLang } from '@/lib/config';
import { clientIp, getOrigin } from '@/lib/req';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const lang = pickLang(body.lang);
  const docLang = pickLang(body.doc_lang ?? body.lang);
  const name = String(body.nom_complet ?? '').trim();
  const email = String(body.email ?? '').trim();

  if (!name) return NextResponse.json({ success: false, error: 'Veuillez renseigner votre nom complet.' });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ success: false, error: 'Veuillez entrer une adresse email valide.' });

  const token = randomBytes(16).toString('hex');
  await saveLead({
    type: 'presentation', name, email, lang, doc_lang: docLang, download_token: token,
    ip: clientIp(req), user_agent: req.headers.get('user-agent'),
  });

  const eName = esc(name), eEmail = esc(email);
  const linkUrl = `${getOrigin(req)}/api/download?t=${token}&l=${docLang}`;

  try {
    // 1) Notification interne (admin)
    const adminContent = `<p style="margin:0 0 16px;line-height:1.6;">Une nouvelle demande de présentation a été reçue :</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;width:160px;">Nom complet</td><td style="padding:8px 0;font-weight:bold;">${eName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${eEmail}" style="color:#F9A825;">${eEmail}</a></td></tr>
      </table>`;
    await sendMail({
      to: mailConfig.notificationEmail,
      replyTo: email,
      subject: `Nouvelle demande de présentation : ${name}`,
      html: emailTemplate('Nouvelle demande de présentation', adminContent, `Demande de présentation de ${name}`, 'fr'),
      text: `Nouvelle demande de présentation\n\nNom : ${name}\nEmail : ${email}\n`,
    });

    // 2) Confirmation à l'utilisateur avec lien de téléchargement (non bloquante)
    try {
      const t = lang === 'en'
        ? { subject: 'Your MobileWallet presentation', title: 'Your presentation is ready', pre: 'Download the MobileWallet presentation.',
            intro: `Hello <strong>${eName}</strong>,`,
            body: 'Thank you for your interest in MobileWallet. You can download our presentation by clicking the button below. Our team will also get back to you very soon.',
            signoff: 'See you soon,', team: 'The MobileWallet Team',
            text: `Hello ${name},\n\nYou can download our presentation here:\n${linkUrl}\n\nSee you soon,\nThe MobileWallet Team` }
        : { subject: 'Votre présentation MobileWallet', title: 'Votre présentation est prête', pre: 'Téléchargez la présentation MobileWallet.',
            intro: `Bonjour <strong>${eName}</strong>,`,
            body: "Nous vous remercions de l'intérêt que vous portez à MobileWallet. Vous pouvez télécharger notre présentation en cliquant sur le bouton ci-dessous. Notre équipe reviendra également vers vous très prochainement.",
            signoff: 'À très bientôt,', team: "L'équipe MobileWallet",
            text: `Bonjour ${name},\n\nVous pouvez télécharger notre présentation ici :\n${linkUrl}\n\nÀ très bientôt,\nL'équipe MobileWallet` };
      const userContent = `<p style="margin:0 0 16px;line-height:1.6;">${t.intro}</p>
        <p style="margin:0 0 20px;line-height:1.6;">${t.body}</p>
        ${downloadBlock(linkUrl, lang)}
        <p style="margin:0;line-height:1.6;">${t.signoff}<br><strong>${t.team}</strong></p>`;
      await sendMail({
        to: email, toName: name, replyTo: mailConfig.notificationEmail,
        subject: t.subject, html: emailTemplate(t.title, userContent, t.pre, lang), text: t.text,
      });
    } catch (e) {
      console.error('confirmation email failed:', e);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('send-presentation error:', e);
    return NextResponse.json({ success: false, error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard." });
  }
}
