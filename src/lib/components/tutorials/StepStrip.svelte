<script lang="ts">
	import { onMount } from 'svelte';
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { m } from '#lib/paraglide/messages.js';
	import type { Tutorial } from '#lib/data/tutorials.ts';

	let {
		tutorial,
		active,
		onpick
	}: {
		tutorial: Tutorial;
		/** Step playing in the studio, -1 when none */
		active: number;
		onpick: (step: number) => void;
	} = $props();

	let pin = $state<HTMLDivElement>();
	let track = $state<HTMLDivElement>();
	let bar = $state<HTMLSpanElement>();

	const pad = (n: number) => String(n).padStart(2, '0');

	onMount(() => {
		let mm: gsap.MatchMedia | undefined;
		let destroyed = false;

		void (async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			if (destroyed || !pin || !track) return;
			gsap.registerPlugin(ScrollTrigger);

			mm = gsap.matchMedia();
			// Wide screens: the section pins and vertical scrolling drives the cards sideways.
			// Smaller screens and reduced motion keep a plain swipeable row.
			mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
				if (!pin || !track) return;
				const distance = () => Math.max(0, track!.scrollWidth - pin!.clientWidth);

				const slide = gsap.to(track, {
					x: () => -distance(),
					ease: 'none',
					scrollTrigger: {
						trigger: pin,
						start: 'center center',
						end: () => `+=${distance()}`,
						pin: true,
						scrub: 0.6,
						invalidateOnRefresh: true,
						onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress })
					}
				});

				// Each card's picture settles from a tilt as it slides into view
				for (const card of track.querySelectorAll<HTMLElement>('.tuto-card')) {
					const media = card.querySelector('.tuto-card-img');
					if (!media) continue;
					gsap.fromTo(
						media,
						{ rotate: -6, scale: 0.82, yPercent: 8 },
						{
							rotate: 0,
							scale: 1,
							yPercent: 0,
							ease: 'power2.out',
							scrollTrigger: { containerAnimation: slide, trigger: card, start: 'left right', end: 'left 45%', scrub: true }
						}
					);
				}
			});
		})();

		return () => {
			destroyed = true;
			mm?.revert();
		};
	});
</script>

<div class="tuto-strip-area ptb-120" id="steps">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.tuto_strip_top()}
			before={m.tuto_strip_before()}
			highlight={m.tuto_strip_highlight()}
			after={m.tuto_strip_after()}
			titleClass="mx-auto mw-720"
		/>
		<p class="tuto-strip-intro text-center mx-auto">{m.tuto_strip_text()}</p>
	</div>

	<div class="tuto-strip" bind:this={pin}>
		<div class="tuto-strip-track" bind:this={track}>
			<div class="tuto-strip-lead" aria-hidden="true">
				<span class="tuto-strip-lead-label">{tutorial.label}</span>
				<span class="tuto-strip-lead-title">{tutorial.title}</span>
				<i class="ti ti-arrow-right"></i>
			</div>
			{#each tutorial.steps as step, i (`${tutorial.id}-${step.n}`)}
				<article class="tuto-card" class:active={i === active} class:done={active > i}>
					<span class="tuto-card-num" aria-hidden="true">{pad(step.n)}</span>
					<div class="tuto-card-img">
						<img src={step.thumb} alt="" width="320" height="320" loading="lazy" />
						{#if i === active}<span class="tuto-card-live"><span></span> {m.tuto_studio_top()}</span>{/if}
					</div>
					<span class="tuto-card-kicker">{m.tuto_step()} {step.n}</span>
					<h3>{step.title}</h3>
					{#if step.note}<p>{step.note}</p>{/if}
					<button type="button" class="tuto-card-play" onclick={() => onpick(i)}>
						<span aria-hidden="true">
							<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12-7.4a1 1 0 0 0 0-1.72l-12-7.4A1 1 0 0 0 7 4.6Z" /></svg>
						</span>
						{m.tuto_play_from()}<span class="visually-hidden">: {m.tuto_step()} {step.n}</span>
					</button>
				</article>
			{/each}
		</div>
		<div class="tuto-strip-progress" aria-hidden="true"><span bind:this={bar}></span></div>
	</div>
</div>
