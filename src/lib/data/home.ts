// Home page content (from the MobileWallet website). Texts live in messages/{locale}.json;
// these functions pair them with images and numbers for the current locale.
import type { CountryCode } from 'libphonenumber-js';
import { m } from '#lib/paraglide/messages.js';

export const bannerStats = () => [
	{ value: 11, suffix: 'x', label: m.hero_stat_1() },
	{ value: 5, suffix: 'x', label: m.hero_stat_2() },
	{ value: 2.2, suffix: m.hero_stat_3_suffix(), label: m.hero_stat_3() }
];

export const marqueeItems = () => [m.marquee_1(), m.marquee_2(), m.marquee_3(), m.marquee_4(), m.marquee_5(), m.marquee_6()];

export const hardwareModels = () => [m.about_model_1(), m.about_model_2(), m.about_model_3()];

/**
 * The team — photos go in static/assets/images/team/ (portrait ~ 4:5, e.g. 600×750)
 * and are referenced as image: 'team/name.jpg'. Without one, the card shows initials.
 */
export const team = (): { name: string; role: string; country: CountryCode; image?: string }[] => [
	{ name: 'Gerald Chenyi', role: m.team_role_founder(), country: 'US', image: 'team/gerald.webp' },
	{ name: 'Yvan Tadie', role: m.team_role_ceo(), country: 'CM', image: 'team/yvan.webp' },
	{ name: 'Duclair Fopa', role: m.team_role_cto(), country: 'CM', image: 'team/duclair.webp' },
	{ name: 'Boris Tardzefe', role: m.team_role_infrastructure(), country: 'CM', image: 'team/boris.webp' },
	{ name: 'Manjob Beto', role: m.team_role_finance(), country: 'CM', image: 'team/beto.webp' },
	{ name: 'Christian Momo', role: m.team_role_design(), country: 'CM', image: 'team/momo.webp' },
	{ name: 'Hussain Murtaza', role: m.team_role_engineering(), country: 'PK', image: 'team/hussain.webp' },
	{ name: 'Muhammad Idrees', role: m.team_role_lead_dev(), country: 'PK', image: 'team/idrees.webp' },
	{ name: 'Toby Cutler', role: m.team_role_advisor(), country: 'US', image: 'team/toby.webp' }
];

export const partners = [
	{ name: 'UBA', image: 'partners/uba.png' },
	{ name: 'NCR', image: 'partners/ncr.svg' },
	{ name: 'KIOSK Information Systems', image: 'partners/kiosk.svg' },
	{ name: 'Chetu', image: 'partners/chetu.png' },
	{ name: 'Hongzhou', image: 'partners/hongzhou.png' },
	{ name: 'MTN', image: 'partners/mtn.svg' },
	{ name: 'Diebold Nixdorf', image: 'partners/diebold-nixdorf.svg' },
	{ name: 'Hyosung', image: 'partners/hyosung.svg' },
	{ name: 'XRPL Commons', image: 'partners/xrpl-commons.svg' },
	{ name: 'BlueCore Africa', image: 'partners/bluecore-africa.png' }
];

type Reason = { title: string; text: string };

export const chooseUsLeft = (): Reason[] => [
	{ title: m.choose_1_title(), text: m.choose_1_text() },
	{ title: m.choose_2_title(), text: m.choose_2_text() },
	{ title: m.choose_3_title(), text: m.choose_3_text() }
];

export const chooseUsRight = (): Reason[] => [
	{ title: m.choose_4_title(), text: m.choose_4_text() },
	{ title: m.choose_5_title(), text: m.choose_5_text() },
	{ title: m.choose_6_title(), text: m.choose_6_text() }
];

export const plans = () => [
	{ image: 'getting1.png', title: m.plan_1_title(), text: m.plan_1_text() },
	{ image: 'getting2.png', title: m.plan_2_title(), text: m.plan_2_text() },
	{ image: 'getting3.png', title: m.plan_3_title(), text: m.plan_3_text() }
];

export const faqs = () => [
	{ question: m.faq_1_q(), answer: m.faq_1_a() },
	{ question: m.faq_2_q(), answer: m.faq_2_a() },
	{ question: m.faq_3_q(), answer: m.faq_3_a() },
	{ question: m.faq_4_q(), answer: m.faq_4_a() },
	{ question: m.faq_5_q(), answer: m.faq_5_a() },
	{ question: m.faq_6_q(), answer: m.faq_6_a() },
	{ question: m.faq_7_q(), answer: m.faq_7_a() },
	{ question: m.faq_8_q(), answer: m.faq_8_a() }
];

export const funFacts = () => [
	{ image: 'fun-fact1.png', value: '24', suffix: 'M+', label: m.market_1() },
	{ image: 'fun-fact2.png', value: '80', suffix: '%+', label: m.market_2() },
	{ image: 'fun-fact3.png', value: '25', suffix: '%', label: m.market_3() },
	{ image: 'fun-fact4.png', value: '500', suffix: 'M+', label: m.market_4() }
];

export const countries = () => [
	{ image: 'united-states.jpg', alt: 'united-states', title: m.country_us(), text: m.country_us_text(), link: m.country_us_link() },
	{ image: 'cameroon.jpg', alt: 'cameroon', title: m.country_cm(), text: m.country_cm_text(), link: m.country_cm_link() },
	{ image: 'ghana.jpg', alt: 'ghana', title: m.country_gh(), text: m.country_expansion_text(), link: m.country_partner_link() },
	{ image: 'uae.jpg', alt: 'dubai', title: m.country_ae(), text: m.country_ae_text(), link: m.country_partner_link() }
];

export const operatorLogos = [
	{ image: 'operators/mtn-momo.png', alt: 'MTN Mobile Money' },
	{ image: 'operators/orange-money.svg', alt: 'Orange Money' },
	{ image: 'operators/wave.png', alt: 'Wave' },
	{ image: 'operators/m-pesa.svg', alt: 'M-Pesa' },
	{ image: 'operators/airtel.svg', alt: 'Airtel Money' },
	{ image: 'partners/uba.png', alt: 'UBA M2U' },
	{ image: 'operators/sara-money.png', alt: 'SARA Money' },
	{ image: 'operators/eneo.png', alt: 'ENEO' },
	{ image: 'operators/camwater.png', alt: 'CAMWATER' },
	{ image: 'operators/canal-plus.svg', alt: 'Canal+' }
];

/** ROI projections — based on real Cameroonian market data */
export const roiCards = () => [
	{ title: m.roi_1_title(), text: m.roi_1_text(), years: 3.7, revenue: 7.4, multi: false },
	{ title: m.roi_2_title(), text: m.roi_2_text(), years: 1.25, revenue: 22.2, multi: true, badge: m.roi_badge_recommended(), featured: true },
	{ title: m.roi_3_title(), text: m.roi_3_text(), years: 3.2, revenue: 22.15, multi: false },
	{ title: m.roi_4_title(), text: m.roi_4_text(), years: 1.1, revenue: 66.45, multi: true, badge: m.roi_badge_best() }
];

export const softwareFeatures = () => [m.software_feature_1(), m.software_feature_2(), m.software_feature_3(), m.software_feature_4()];
