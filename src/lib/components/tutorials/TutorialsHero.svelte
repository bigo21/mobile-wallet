<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { tutorials as getTutorials, type TutorialId } from '#lib/data/tutorials.ts';

	let { onwatch }: { onwatch: (id: TutorialId) => void } = $props();

	const all = getTutorials();

	// Headline words animate in one after the other (pure CSS, so nothing flashes before hydration)
	const words = (text: string) => text.split(' ').filter(Boolean);
	const headline = [
		...words(m.tuto_title_before()).map((w) => ({ w, hl: false })),
		...[{ w: m.tuto_title_highlight(), hl: true }],
		...words(m.tuto_title_after()).map((w) => ({ w, hl: false }))
	];

	/** Which step thumbnail each card shows */
	// Offset so the two cards never show the same step at once
	let frames = $state<Record<TutorialId, number>>({ deposit: 0, withdrawal: 5 });
	let hovering = $state<TutorialId | null>(null);

	// Mouse: the step follows the pointer across the card
	function scrub(event: PointerEvent, id: TutorialId) {
		if (event.pointerType !== 'mouse') return;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		frames[id] = Math.min(9, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * 10)));
	}

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Otherwise the cards slowly page through their steps on their own
		const timer = setInterval(() => {
			if (document.hidden) return;
			for (const t of all) if (hovering !== t.id) frames[t.id] = (frames[t.id] + 1) % 10;
		}, 1600);
		return () => clearInterval(timer);
	});
</script>

<div class="tuto-hero">
	<!-- The same circles, rings and dots as the videos' artwork -->
	<div class="tuto-hero-deco" aria-hidden="true">
		<span class="deco-disc"></span>
		<span class="deco-ring deco-ring-1"></span>
		<span class="deco-ring deco-ring-2"></span>
		<span class="deco-dot deco-dot-1"></span>
		<span class="deco-dot deco-dot-2"></span>
		<span class="deco-dot deco-dot-3"></span>
	</div>

	<div class="container mw-1690 position-relative">
		<div class="tuto-hero-head">
			<span class="top-title">{m.tuto_top()}</span>
			<h1>
				{#each headline as word, i (i)}
					<span class="tuto-word" class:under-line={word.hl} style:--i={i}><span>{word.w}</span></span>{' '}
				{/each}
			</h1>
			<p class="tuto-lede">{m.tuto_lede()}</p>
		</div>

		<p class="tuto-pick"><span>{m.tuto_pick()}</span> <i class="ti ti-arrow-down"></i></p>

		<div class="tuto-cards">
			{#each all as t, n (t.id)}
				<article class="tuto-ticket" class:is-withdrawal={t.id === 'withdrawal'} style:--d="{0.55 + n * 0.12}s">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="tuto-ticket-visual"
						onpointermove={(e) => scrub(e, t.id)}
						onpointerenter={(e) => e.pointerType === 'mouse' && (hovering = t.id)}
						onpointerleave={() => (hovering = null)}
					>
						{#each t.steps as step, i (step.n)}
							<img
								src={step.thumb}
								alt=""
								width="320"
								height="320"
								loading={i === 0 ? 'eager' : 'lazy'}
								class:shown={frames[t.id] === i}
							/>
						{/each}
						<span class="tuto-ticket-step" aria-hidden="true">
							<small>{m.tuto_step()}</small>{frames[t.id] + 1}
						</span>
						<span class="tuto-ticket-ticks" aria-hidden="true">
							{#each t.steps as step, i (step.n)}<span class:on={i <= frames[t.id]}></span>{/each}
						</span>
						<span class="tuto-ticket-caption" aria-hidden="true">{t.steps[frames[t.id]].title}</span>
						<span class="tuto-ticket-hint" aria-hidden="true"><i class="ti ti-arrows-horizontal"></i> {m.tuto_hover_hint()}</span>
					</div>

					<div class="tuto-ticket-body">
						<div class="tuto-ticket-top">
							<span class="tuto-ticket-index" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
							<span class="tuto-ticket-tag">
								<i class="ti {t.id === 'deposit' ? 'ti-arrow-down' : 'ti-cash-banknote'}"></i>
								{t.label}
							</span>
						</div>
						<h2>{t.title}</h2>
						<p>{t.text}</p>
						<ul class="tuto-ticket-meta">
							<li><i class="ti ti-list-numbers"></i> {m.tuto_steps_count()}</li>
							<li><i class="ti ti-clock"></i> 1:00</li>
							<li><i class="ti ti-language"></i> {m.tuto_both_languages()}</li>
							<li><i class="ti ti-rectangle"></i><i class="ti ti-rectangle-vertical"></i> 16:9 · 9:16</li>
						</ul>
						<button type="button" class="default-btn tuto-ticket-cta" onclick={() => onwatch(t.id)}>
							<span class="tuto-ticket-cta-icon" aria-hidden="true">
								<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12-7.4a1 1 0 0 0 0-1.72l-12-7.4A1 1 0 0 0 7 4.6Z" /></svg>
							</span>
							{m.tuto_watch()} — {t.label}
						</button>
					</div>
				</article>
			{/each}
		</div>
	</div>
</div>
