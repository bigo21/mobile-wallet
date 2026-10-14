import { m } from '#lib/paraglide/messages.js';
import { localizeHref } from '#lib/paraglide/runtime.js';

// Content is built by functions (not constants) so each render resolves messages
// in the current locale — on the server that's per request.

export const img = (name: string) => `/assets/images/${name}`;

/** An internal link in the current locale ("/#about" → "/fr#about" in French) */
export const link = (path: string) =>
	// drop the trailing slash ("/fr/#about") that would otherwise cost a redirect
	localizeHref(path).replace(/^(\/[^#?]+?)\/(?=[#?]|$)/, '$1');

export const email = 'support@mobilewalletinc.com';

export const contact = () => ({
	location: m.location_full(),
	locationShort: m.location_short(),
	email,
	emailHref: `mailto:${email}`,
	appointmentHref: `mailto:${email}?subject=${encodeURIComponent(m.appointment_subject())}`
});

export const socials = [
	{ href: 'https://www.facebook.com/MobileWalletPLC/', icon: 'ti-brand-facebook', label: 'Facebook' },
	{ href: 'https://www.linkedin.com/company/mobile-wallet', icon: 'ti-brand-linkedin', label: 'LinkedIn' },
	{ href: 'https://x.com/mobilewalletinc', icon: 'ti-brand-x', label: 'X' }
];

export const languages = [
	{ locale: 'en', label: 'English', flag: 'uk.png' },
	{ locale: 'fr', label: 'Français', flag: 'france.png' }
] as const;

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; href?: string; children?: (NavLink | NavGroup)[] };

export const isGroup = (item: NavLink | NavGroup): item is NavGroup => 'children' in item;

export const navigation = (): NavGroup[] => [
	{ label: m.nav_home(), href: link('/') },
	{ label: m.nav_about(), href: link('/#about') },
	{ label: m.nav_market(), href: link('/#market') },
	{ label: m.nav_solutions(), href: link('/#solutions') },
	{ label: m.nav_plans(), href: link('/#plans') },
	{ label: m.nav_contact(), href: link('/#contact') }
];

/** Flattens nested groups — the mobile menu shows sub-groups as a single list. */
export function flattenLinks(items: (NavLink | NavGroup)[]): NavLink[] {
	return items.flatMap((item) => (isGroup(item) ? flattenLinks(item.children ?? []) : [item]));
}

export const footerColumns = () => [
	{
		title: m.footer_nav_title(),
		links: [
			{ label: m.nav_market(), href: link('/#market') },
			{ label: m.nav_solutions(), href: link('/#solutions') },
			{ label: m.nav_about(), href: link('/#about') },
			{ label: m.nav_plans(), href: link('/#plans') },
			{ label: m.nav_faq(), href: link('/#faq') }
		]
	},
	{
		title: m.footer_solutions_title(),
		links: [
			{ label: m.footer_link_franchise(), href: link('/#plans') },
			{ label: m.footer_link_bring_atm(), href: link('/#plans') },
			{ label: m.footer_link_saas(), href: link('/#plans') },
			{ label: m.footer_link_partner(), href: link('/#contact') },
			{ label: m.footer_link_dashboard(), href: link('/#solutions') }
		]
	}
];
