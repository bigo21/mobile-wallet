<script lang="ts">
	import { page } from '$app/state';
	import { link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { cut, tutorials as getTutorials, type TutorialId } from '#lib/data/tutorials.ts';
	import StepStrip from '#lib/components/tutorials/StepStrip.svelte';
	import TutorialStudio from '#lib/components/tutorials/TutorialStudio.svelte';
	import TutorialsHero from '#lib/components/tutorials/TutorialsHero.svelte';

	const all = getTutorials();

	let studio = $state<ReturnType<typeof TutorialStudio>>();
	let tutorial = $state<TutorialId>('deposit');
	let active = $state(-1);
	const current = $derived(all.find((t) => t.id === tutorial) ?? all[0]);

	const toStudio = () => document.getElementById('watch')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

	function watch(id: TutorialId) {
		studio?.select(id);
		toStudio();
	}

	function playStep(i: number) {
		studio?.playStep(i);
		toStudio();
	}

	// Search engines: one VideoObject per tutorial, in the page's language
	const lang = getLocale() === 'fr' ? 'fr' : 'en';
	const jsonLd = $derived(
		JSON.stringify(
			all.map((t) => {
				const c = cut(t.id, lang, 'landscape');
				return {
					'@context': 'https://schema.org',
					'@type': 'VideoObject',
					name: t.title,
					description: t.text,
					inLanguage: lang,
					thumbnailUrl: new URL(c.poster, page.url.origin).href,
					contentUrl: new URL(c.src, page.url.origin).href,
					uploadDate: '2026-11-18',
					duration: `PT${Math.round(c.duration)}S`
				};
			})
		).replace(/</g, '\\u003c')
	);
</script>

<svelte:head>
	<title>{m.tuto_meta_title()} | MobileWallet</title>
	<meta name="description" content={m.tuto_meta_description()} />
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<TutorialsHero onwatch={watch} />
<TutorialStudio bind:this={studio} bind:tutorial bind:active />
<StepStrip tutorial={current} {active} onpick={playStep} />

<div class="tuto-help-area pb-120">
	<div class="container mw-1690">
		<div class="tuto-help" data-cues="slideInUp" data-duration="900">
			<div class="tuto-help-main">
				<span class="top-title">{m.tuto_help_top()}</span>
				<h2 class="main-title">
					{m.tuto_help_title_before()} <span class="under-line">{m.tuto_help_title_highlight()}</span>
					{m.tuto_help_title_after()}
				</h2>
				<p>{m.tuto_help_text()}</p>
				<div class="tuto-help-actions">
					<button type="button" class="default-btn active" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
						{m.tuto_help_contact()}
					</button>
					<a href={link('/#demo')} class="default-btn">{m.tuto_help_demo()}</a>
				</div>
			</div>
			<div class="tuto-help-tip">
				<span class="tuto-help-tip-icon" aria-hidden="true"><i class="ti ti-lock"></i></span>
				<p>{m.tuto_safety()}</p>
			</div>
		</div>
	</div>
</div>
