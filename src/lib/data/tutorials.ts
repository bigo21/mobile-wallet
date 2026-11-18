import { m } from '#lib/paraglide/messages.js';

export type TutorialId = 'deposit' | 'withdrawal';
export type VideoLang = 'en' | 'fr';
export type VideoFormat = 'landscape' | 'portrait';

export const videoLangs: VideoLang[] = ['en', 'fr'];
export const videoFormats: VideoFormat[] = ['landscape', 'portrait'];

/** One recording per language. Both formats share the same timeline. */
type Cut = {
	/** File name without the "_16x9.mp4" / "_9x16.mp4" suffix */
	file: string;
	duration: number;
	/** When each of the 10 numbered steps appears on screen (seconds) */
	steps: number[];
	/** When the closing "contact support" card appears */
	outro: number;
};

// Step times were read off the "STEP n" badge that each video shows on screen
const cuts: Record<TutorialId, Record<VideoLang, Cut>> = {
	deposit: {
		en: {
			file: 'MobileWallet_Tuto_Deposit_EN',
			duration: 60.8,
			steps: [3.5, 7.5, 11, 16, 19.5, 25, 29, 33.5, 43, 48.5],
			outro: 54
		},
		fr: {
			file: 'MobileWallet_Tuto_Depot_FR',
			duration: 60.3,
			steps: [4, 8, 11, 16.5, 19.5, 25, 30, 34.5, 43, 48.5],
			outro: 54
		}
	},
	withdrawal: {
		en: {
			file: 'MobileWallet_Tuto_Withdrawal_EN',
			duration: 60.7,
			steps: [4, 8, 11.5, 16.5, 19.5, 25, 30.5, 37.5, 43.5, 48.5],
			outro: 54
		},
		fr: {
			file: 'MobileWallet_Tuto_Retrait_FR',
			duration: 58.8,
			steps: [4, 7.5, 11, 16, 19, 24, 30, 36.5, 43, 48],
			outro: 52
		}
	}
};

const stepText = {
	deposit: () => [
		[m.tuto_dep_1_title(), m.tuto_dep_1_note()],
		[m.tuto_dep_2_title(), m.tuto_dep_2_note()],
		[m.tuto_dep_3_title(), m.tuto_dep_3_note()],
		[m.tuto_dep_4_title(), m.tuto_dep_4_note()],
		[m.tuto_dep_5_title(), m.tuto_dep_5_note()],
		[m.tuto_dep_6_title(), m.tuto_dep_6_note()],
		[m.tuto_dep_7_title(), m.tuto_dep_7_note()],
		[m.tuto_dep_8_title(), m.tuto_dep_8_note()],
		[m.tuto_dep_9_title(), m.tuto_dep_9_note()],
		[m.tuto_dep_10_title(), m.tuto_dep_10_note()]
	],
	withdrawal: () => [
		[m.tuto_wd_1_title(), m.tuto_wd_1_note()],
		[m.tuto_wd_2_title(), m.tuto_wd_2_note()],
		[m.tuto_wd_3_title(), m.tuto_wd_3_note()],
		[m.tuto_wd_4_title(), m.tuto_wd_4_note()],
		[m.tuto_wd_5_title(), m.tuto_wd_5_note()],
		[m.tuto_wd_6_title(), m.tuto_wd_6_note()],
		[m.tuto_wd_7_title(), m.tuto_wd_7_note()],
		[m.tuto_wd_8_title(), m.tuto_wd_8_note()],
		[m.tuto_wd_9_title(), m.tuto_wd_9_note()],
		[m.tuto_wd_10_title(), m.tuto_wd_10_note()]
	]
} satisfies Record<TutorialId, () => string[][]>;

export type Step = { n: number; title: string; note: string; thumb: string };

/** A tutorial's copy, in the site's language. */
export const tutorials = () =>
	(['deposit', 'withdrawal'] as const).map((id) => ({
		id,
		label: id === 'deposit' ? m.tuto_deposit() : m.tuto_withdrawal(),
		title: id === 'deposit' ? m.tuto_deposit_title() : m.tuto_withdrawal_title(),
		text: id === 'deposit' ? m.tuto_deposit_text() : m.tuto_withdrawal_text(),
		steps: stepText[id]().map(
			([title, note], i): Step => ({
				n: i + 1,
				title,
				note,
				thumb: `/assets/images/tutorials/steps/${id}-${String(i + 1).padStart(2, '0')}.webp`
			})
		)
	}));

export type Tutorial = ReturnType<typeof tutorials>[number];

/** The video for a tutorial in a given language and format. */
export function cut(id: TutorialId, lang: VideoLang, format: VideoFormat) {
	const c = cuts[id][lang];
	return {
		...c,
		src: `/assets/videos/${c.file}_${format === 'landscape' ? '16x9' : '9x16'}.mp4`,
		poster: `/assets/images/tutorials/${id}-${lang}-${format}.webp`
	};
}

export const clock = (seconds: number) => {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
