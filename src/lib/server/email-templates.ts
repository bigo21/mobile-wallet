// Email templates. Plain functions with no imports, so they can be rendered and
// previewed outside SvelteKit. Built for email clients, not browsers: table layout,
// inline styles, web-safe fonts, and a <style> block only for progressive extras
// (dark mode, mobile tweaks) that clients without <style> support simply ignore.

const brand = {
	orange: '#FA6503',
	yellow: '#FBCA06',
	blue: '#013F55',
	blue2: '#026B90',
	ink: '#16191D', // not pure black, which some dark modes handle badly
	body: '#4A5560',
	muted: '#7A8691',
	line: '#E6EBEF',
	tint: '#EFF6FF',
	canvas: '#F2F4F7'
};
const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const escapeHtml = (text: string) =>
	text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const e = escapeHtml;

export type Footer = {
	siteUrl: string;
	location: string;
	email: string;
	socials: { label: string; href: string }[];
	/** Why the reader got this email */
	reason: string;
};

type Document = {
	lang: string;
	title: string;
	/** Preview text shown next to the subject in the inbox */
	preheader: string;
	logoUrl: string;
	siteUrl: string;
	body: string;
	footer: Footer;
};

export function emailDocument({ lang, title, preheader, logoUrl, siteUrl, body, footer }: Document) {
	// Zero-width filler keeps the client from pulling body text into the preview
	const filler = '&#847;&zwnj;&nbsp;'.repeat(60);
	return `<!doctype html>
<html lang="${e(lang)}" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${e(title)}</title>
<style>
	body { margin: 0; padding: 0; }
	a { color: ${brand.blue2}; }
	@media (max-width: 620px) {
		.container { width: 100% !important; border-radius: 0 !important; }
		.px { padding-left: 24px !important; padding-right: 24px !important; }
		.h1 { font-size: 24px !important; line-height: 32px !important; }
		.stack { display: block !important; width: 100% !important; }
		.stat { padding: 0 0 16px !important; }
	}
	@media (prefers-color-scheme: dark) {
		.canvas { background: #0E1418 !important; }
		.card { background: #172026 !important; }
		.tint { background: #1D2A32 !important; border-color: #2A3A44 !important; }
		.ink { color: #F1F4F6 !important; }
		.body { color: #C2CBD2 !important; }
		.muted { color: #8D9AA4 !important; }
		.line { border-color: #2A3A44 !important; }
		.accent { color: #5CC3EA !important; }
	}
</style>
</head>
<body class="canvas" style="margin:0;padding:0;background:${brand.canvas};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${e(preheader)}${filler}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="canvas" style="background:${brand.canvas};">
<tr><td align="center" style="padding:32px 12px;">
	<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container card" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden;">
		<tr><td style="font-size:0;line-height:0;">
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
				<td height="5" style="height:5px;background:${brand.blue2};width:33%;"></td>
				<td height="5" style="height:5px;background:${brand.orange};width:34%;"></td>
				<td height="5" style="height:5px;background:${brand.yellow};width:33%;"></td>
			</tr></table>
		</td></tr>
		<tr><td class="px" style="padding:32px 48px 8px;">
			<a href="${e(siteUrl)}" style="text-decoration:none;"><img src="${e(logoUrl)}" width="168" alt="MobileWallet" style="display:block;width:168px;max-width:168px;height:auto;border:0;"></a>
		</td></tr>
		${body}
		${footerBlock(footer, logoUrl)}
	</table>
</td></tr>
</table>
</body>
</html>`;
}

function footerBlock({ siteUrl, location, email, socials, reason }: Footer, logoUrl: string) {
	const links = socials
		.map((s) => `<a href="${e(s.href)}" style="color:#FFFFFF;text-decoration:none;font-weight:600;">${e(s.label)}</a>`)
		.join('<span style="color:#4E7C8F;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>');
	return `<tr><td class="px" style="padding:32px 48px;background:${brand.blue};font-family:${font};">
		<p style="margin:0 0 6px;font-size:15px;line-height:22px;color:#FFFFFF;font-weight:700;">MobileWallet Incorporated</p>
		<p style="margin:0 0 18px;font-size:13px;line-height:20px;color:#A9C6D3;">${e(location)}<br><a href="mailto:${e(email)}" style="color:#A9C6D3;">${e(email)}</a> · <a href="${e(siteUrl)}" style="color:#A9C6D3;">${e(siteUrl.replace(/^https?:\/\//, ''))}</a></p>
		<p style="margin:0 0 18px;font-size:13px;line-height:20px;">${links}</p>
		<p style="margin:0;font-size:12px;line-height:18px;color:#7FA3B3;">${e(reason)}</p>
	</td></tr>`;
}

// — Building blocks —

export const section = (html: string, { top = 16, bottom = 16 } = {}) =>
	`<tr><td class="px" style="padding:${top}px 48px ${bottom}px;font-family:${font};">${html}</td></tr>`;

export const eyebrow = (text: string) =>
	`<p style="margin:0 0 10px;font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${brand.orange};">${e(text)}</p>`;

export const heading = (text: string) =>
	`<h1 class="h1 ink" style="margin:0;font-size:28px;line-height:36px;font-weight:800;color:${brand.ink};letter-spacing:-0.3px;">${e(text)}</h1>`;

export const paragraph = (text: string, { strong = false, size = 16 } = {}) =>
	`<p class="${strong ? 'ink' : 'body'}" style="margin:0 0 16px;font-size:${size}px;line-height:${Math.round(size * 1.6)}px;color:${strong ? brand.ink : brand.body};${strong ? 'font-weight:700;' : ''}">${e(text)}</p>`;

/** Table-based button: renders as a solid button even in Outlook */
export const button = (label: string, href: string, { color = brand.orange, text = brand.ink } = {}) =>
	`<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
		<td align="center" bgcolor="${color}" style="border-radius:10px;background:${color};">
			<a href="${e(href)}" style="display:inline-block;padding:15px 30px;font-family:${font};font-size:16px;line-height:20px;font-weight:700;color:${text};text-decoration:none;border-radius:10px;">${e(label)}&nbsp;&rarr;</a>
		</td>
	</tr></table>`;

export function attachmentCard({ filename, meta, label }: { filename: string; meta: string; label: string }) {
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="tint" style="background:${brand.tint};border:1px solid #D7E6F5;border-radius:12px;">
		<tr>
			<td width="64" valign="middle" style="padding:18px 0 18px 18px;">
				<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
					<td width="46" height="56" align="center" valign="middle" bgcolor="${brand.orange}" style="width:46px;height:56px;background:${brand.orange};border-radius:8px;font-family:${font};font-size:12px;font-weight:800;color:#FFFFFF;letter-spacing:0.5px;">PDF</td>
				</tr></table>
			</td>
			<td valign="middle" style="padding:18px 18px 18px 14px;font-family:${font};">
				<p class="ink" style="margin:0 0 4px;font-size:15px;line-height:20px;font-weight:700;color:${brand.ink};word-break:break-word;">${e(filename)}</p>
				<p class="muted" style="margin:0;font-size:13px;line-height:18px;color:${brand.muted};">${e(meta)}</p>
				<p class="accent" style="margin:6px 0 0;font-size:13px;line-height:18px;font-weight:700;color:${brand.blue2};">&#128206;&nbsp;${e(label)}</p>
			</td>
		</tr>
	</table>`;
}

export function checklist(title: string, items: string[]) {
	const rows = items
		.map(
			(item) => `<tr>
				<td width="30" valign="top" style="padding:0 0 12px;">
					<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="20" height="20" align="center" valign="middle" bgcolor="${brand.yellow}" style="width:20px;height:20px;background:${brand.yellow};border-radius:10px;font-size:12px;line-height:20px;font-weight:800;color:${brand.ink};font-family:${font};">&#10003;</td></tr></table>
				</td>
				<td valign="top" class="body" style="padding:0 0 12px;font-family:${font};font-size:15px;line-height:21px;color:${brand.body};">${e(item)}</td>
			</tr>`
		)
		.join('');
	return `<p class="ink" style="margin:0 0 14px;font-size:16px;line-height:22px;font-weight:700;color:${brand.ink};">${e(title)}</p>
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
}

export function stats(items: { value: string; label: string }[]) {
	const cells = items
		.map(
			(s, i) => `<td class="stack stat" width="${Math.floor(100 / items.length)}%" valign="top" style="padding:0 ${i < items.length - 1 ? 12 : 0}px 0 0;">
				<p class="accent" style="margin:0;font-family:${font};font-size:26px;line-height:32px;font-weight:800;color:${brand.blue2};">${e(s.value)}</p>
				<p class="muted" style="margin:4px 0 0;font-family:${font};font-size:13px;line-height:18px;color:${brand.muted};">${e(s.label)}</p>
			</td>`
		)
		.join('');
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="line" style="border-top:1px solid ${brand.line};border-bottom:1px solid ${brand.line};">
		<tr><td style="padding:22px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>
	</table>`;
}

/** Label / value rows for the internal notifications */
export function details(rows: [string, string | { text: string; href: string }][]) {
	const body = rows
		.map(([label, value], i) => {
			const border = i < rows.length - 1 ? `border-bottom:1px solid ${brand.line};` : '';
			const content = typeof value === 'string' ? e(value) : `<a href="${e(value.href)}" style="color:${brand.blue2};text-decoration:none;">${e(value.text)}</a>`;
			return `<tr>
				<td width="130" valign="top" class="muted line" style="padding:12px 12px 12px 0;${border}font-family:${font};font-size:13px;line-height:20px;color:${brand.muted};">${e(label)}</td>
				<td valign="top" class="ink line" style="padding:12px 0;${border}font-family:${font};font-size:15px;line-height:20px;font-weight:600;color:${brand.ink};word-break:break-word;">${content}</td>
			</tr>`;
		})
		.join('');
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${body}</table>`;
}

export const quote = (label: string, text: string) =>
	`<p class="muted" style="margin:0 0 10px;font-size:13px;line-height:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${brand.muted};">${e(label)}</p>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="tint" style="background:${brand.tint};border-radius:0 10px 10px 0;">
		<tr><td style="border-left:4px solid ${brand.orange};padding:16px 20px;font-family:${font};font-size:15px;line-height:24px;color:${brand.ink};white-space:pre-wrap;" class="ink">${e(text)}</td></tr>
	</table>`;

export const badge = (text: string) =>
	`<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${brand.yellow};font-size:12px;line-height:16px;font-weight:700;color:${brand.ink};">${e(text)}</span>`;

export const spacer = (height: number) => `<tr><td height="${height}" style="height:${height}px;font-size:0;line-height:0;">&nbsp;</td></tr>`;

// — The emails —

type Common = { logoUrl: string; siteUrl: string; footer: Footer };

export type PresentationCopy = {
	subject: string;
	preheader: string;
	eyebrow: string;
	title: string;
	greeting: string;
	intro: string;
	attachmentLabel: string;
	insideTitle: string;
	inside: string[];
	stats: { value: string; label: string }[];
	ctaIntro: string;
	cta: string;
	help: string;
	signoff: string;
	team: string;
};

/** Sent to the visitor, with the PDF attached */
export function presentationEmail({ lang, copy, filename, meta, ctaHref, ...common }: Common & { lang: string; copy: PresentationCopy; filename: string; meta: string; ctaHref: string }) {
	const body = [
		section(eyebrow(copy.eyebrow) + heading(copy.title), { top: 24, bottom: 20 }),
		section(paragraph(copy.greeting, { strong: true }) + paragraph(copy.intro), { top: 0, bottom: 8 }),
		section(attachmentCard({ filename, meta, label: copy.attachmentLabel }), { top: 0, bottom: 28 }),
		section(checklist(copy.insideTitle, copy.inside), { top: 0, bottom: 12 }),
		section(stats(copy.stats), { top: 0, bottom: 28 }),
		section(paragraph(copy.ctaIntro) + button(copy.cta, ctaHref), { top: 0, bottom: 28 }),
		section(paragraph(copy.help, { size: 15 }) + `<p class="ink" style="margin:0;font-size:15px;line-height:24px;color:#16191D;">${e(copy.signoff)}<br><strong>${e(copy.team)}</strong></p>`, { top: 0, bottom: 40 })
	].join('');

	const text = [
		copy.greeting,
		'',
		copy.intro,
		'',
		`${copy.attachmentLabel}: ${filename} (${meta})`,
		'',
		copy.insideTitle,
		...copy.inside.map((item) => `- ${item}`),
		'',
		`${copy.ctaIntro} ${copy.cta}: ${ctaHref}`,
		'',
		copy.help,
		'',
		copy.signoff,
		copy.team
	].join('\n');

	return { subject: copy.subject, html: emailDocument({ lang, title: copy.subject, preheader: copy.preheader, body, ...common }), text };
}

type Value = string | { text: string; href: string };

function notification({ title, tag, intro, rows, message, replyTo, replyName, sentAt, ...common }: Common & { title: string; tag: string; intro: string; rows: [string, Value][]; message?: string; replyTo: string; replyName: string; sentAt: string }) {
	const replyHref = `mailto:${replyTo}`;
	const body = [
		section(`${badge(tag)}<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>${heading(title)}`, { top: 24, bottom: 12 }),
		section(paragraph(intro, { size: 15 }), { top: 0, bottom: 8 }),
		section(details(rows), { top: 0, bottom: message ? 24 : 28 }),
		message ? section(quote('Message', message), { top: 0, bottom: 28 }) : '',
		section(button(`Reply to ${replyName}`, replyHref) + `<p class="muted" style="margin:16px 0 0;font-size:13px;line-height:20px;color:#7A8691;">Or simply hit reply — it goes straight to ${e(replyTo)}.</p>`, { top: 0, bottom: 20 }),
		section(`<p class="muted" style="margin:0;font-size:12px;line-height:18px;color:#7A8691;">${e(sentAt)}</p>`, { top: 0, bottom: 36 })
	].join('');
	const plain = (v: Value) => (typeof v === 'string' ? v : v.text);
	const text = [title, '', intro, '', ...rows.map(([k, v]) => `${k}: ${plain(v)}`), ...(message ? ['', 'Message:', message] : []), '', `Reply to ${replyName}: ${replyTo}`, '', sentAt].join('\n');
	return { html: emailDocument({ lang: 'en', title, preheader: intro, body, ...common }), text };
}

/** Sent to support when someone uses the contact form */
export function contactNotification(p: Common & { name: string; email: string; company?: string; phone?: string; interest: string; message: string; siteLanguage: string; sentAt: string }) {
	const rows: [string, Value][] = [
		['Name', p.name],
		['Email', { text: p.email, href: `mailto:${p.email}` }],
		...(p.company ? ([['Company', p.company]] as [string, Value][]) : []),
		...(p.phone ? ([['Phone', { text: p.phone, href: `tel:${p.phone.replace(/\s+/g, '')}` }]] as [string, Value][]) : []),
		['Interested in', p.interest],
		['Site language', p.siteLanguage]
	];
	return {
		subject: `New enquiry — ${p.interest} — ${p.name}`,
		...notification({
			...p,
			title: `New enquiry from ${p.name}`,
			tag: 'Contact form',
			intro: `${p.name} sent a message through the website contact form.`,
			rows,
			message: p.message,
			replyTo: p.email,
			replyName: p.name.split(/\s+/)[0]
		})
	};
}

/** Sent to support when someone requests the presentation */
export function leadNotification(p: Common & { name: string; email: string; language: string; sentAt: string }) {
	return {
		subject: `Presentation requested — ${p.name}`,
		...notification({
			...p,
			title: `${p.name} requested the presentation`,
			tag: 'New lead',
			intro: `The ${p.language} presentation was emailed to them automatically. This is a good moment to follow up.`,
			rows: [
				['Name', p.name],
				['Email', { text: p.email, href: `mailto:${p.email}` }],
				['Document', `${p.language} presentation`]
			],
			replyTo: p.email,
			replyName: p.name.split(/\s+/)[0]
		})
	};
}
