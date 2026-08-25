import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/db';
import { sendMail, emailTemplate, esc } from '@/lib/email';
import { mailConfig, pickLang } from '@/lib/config';
import { clientIp } from '@/lib/req';

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
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const country = String(body.country ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name) return NextResponse.json({ success: false, error: 'Veuillez renseigner votre nom complet.' });
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ success: false, error: 'Veuillez entrer une adresse email valide.' });
  if (!phone || phone.length < 8) return NextResponse.json({ success: false, error: 'Veuillez renseigner un numéro de téléphone valide.' });

  await saveLead({
    type: 'contact', name, email, country, phone, message, lang,
    ip: clientIp(req), user_agent: req.headers.get('user-agent'),
  });

  const eName = esc(name), eEmail = esc(email), eCountry = esc(country), ePhone = esc(phone);
  const eMessage = esc(message).replace(/\n/g, '<br>');

  try {
    // 1) Notification interne (admin)
    const adminContent = `<p style="margin:0 0 16px;line-height:1.6;">Une nouvelle demande de rendez-vous stratégique a été reçue :</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;width:160px;">Nom complet</td><td style="padding:8px 0;font-weight:bold;">${eName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${eEmail}" style="color:#F9A825;">${eEmail}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;">Pays</td><td style="padding:8px 0;">${eCountry}</td></tr>
        <tr><td style="padding:8px 0;color:#666;">Téléphone</td><td style="padding:8px 0;">${ePhone}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background-color:#fafafa;border-left:3px solid #F9A825;border-radius:4px;">
        <p style="margin:0 0 6px;color:#666;font-size:13px;">Message :</p>
        <p style="margin:0;line-height:1.6;">${eMessage || '<em style="color:#999;">(aucun message)</em>'}</p>
      </div>`;
    await sendMail({
      to: mailConfig.notificationEmail,
      replyTo: email,
      subject: `Nouvelle demande de RDV : ${name}`,
      html: emailTemplate('Nouvelle demande de rendez-vous', adminContent, `Demande de RDV de ${name}`, 'fr'),
      text: `Nouvelle demande de rendez-vous\n\nNom : ${name}\nEmail : ${email}\nPays : ${country}\nTéléphone : ${phone}\n\nMessage :\n${message}\n`,
    });

    // 2) Confirmation à l'utilisateur (non bloquante)
    try {
      const t = lang === 'en'
        ? { subject: 'Your appointment request — MobileWallet', title: 'We have received your request', pre: 'We have received your appointment request.',
            intro: `Hello <strong>${eName}</strong>,`,
            body: 'We have received your strategic appointment request. Our team is reviewing it and will get back to you very soon at the phone number or address you provided.',
            recap: 'Summary of your request:', lblCty: 'Country', lblPhn: 'Phone', signoff: 'Thank you for your trust,', team: 'The MobileWallet Team',
            text: `Hello ${name},\n\nWe have received your strategic appointment request. Our team will get back to you very soon.\n\nThank you for your trust,\nThe MobileWallet Team` }
        : { subject: 'Votre demande de rendez-vous — MobileWallet', title: 'Votre demande a bien été reçue', pre: 'Nous avons bien reçu votre demande de rendez-vous.',
            intro: `Bonjour <strong>${eName}</strong>,`,
            body: "Nous avons bien reçu votre demande de rendez-vous stratégique. Notre équipe l'étudie et vous recontactera très prochainement au numéro ou à l'adresse que vous nous avez communiqués.",
            recap: 'Récapitulatif de votre demande :', lblCty: 'Pays', lblPhn: 'Téléphone', signoff: 'Merci de votre confiance,', team: "L'équipe MobileWallet",
            text: `Bonjour ${name},\n\nNous avons bien reçu votre demande de rendez-vous stratégique. Notre équipe vous recontactera très prochainement.\n\nMerci de votre confiance,\nL'équipe MobileWallet` };
      const userContent = `<p style="margin:0 0 16px;line-height:1.6;">${t.intro}</p>
        <p style="margin:0 0 16px;line-height:1.6;">${t.body}</p>
        <div style="margin:20px 0;padding:16px;background-color:#fafafa;border-left:3px solid #F9A825;border-radius:4px;font-size:14px;">
          <p style="margin:0 0 6px;color:#666;">${t.recap}</p>
          <p style="margin:0;line-height:1.7;">${t.lblCty} : ${eCountry}<br>${t.lblPhn} : ${ePhone}</p>
        </div>
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
    console.error('send-contact error:', e);
    return NextResponse.json({ success: false, error: "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard." });
  }
}
