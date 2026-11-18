<script lang="ts">
	import { flushSync, onMount, tick } from 'svelte';
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import {
		clock,
		cut,
		tutorials as getTutorials,
		videoFormats,
		videoLangs,
		type TutorialId,
		type VideoFormat,
		type VideoLang
	} from '#lib/data/tutorials.ts';

	let {
		tutorial = $bindable<TutorialId>('deposit'),
		active = $bindable(-1)
	}: {
		tutorial?: TutorialId;
		/** Step being played (0–9), -1 before the first step / before playback, 10 on the closing card */
		active?: number;
	} = $props();

	const all = getTutorials();
	const speeds = [1, 1.25, 1.5, 0.75];
	const flags: Record<VideoLang, string> = { en: 'uk.png', fr: 'france.png' };

	// The site language picks the narration by default; viewers can switch it independently
	let lang = $state<VideoLang>(getLocale() === 'fr' ? 'fr' : 'en');
	let format = $state<VideoFormat>('landscape');

	const info = $derived(all.find((t) => t.id === tutorial) ?? all[0]);
	const other = $derived(all.find((t) => t.id !== tutorial) ?? all[1]);
	const c = $derived(cut(tutorial, lang, format));

	let video = $state<HTMLVideoElement>();
	let player = $state<HTMLDivElement>();
	let stage = $state<HTMLDivElement>();
	let rail = $state<HTMLOListElement>();
	let currentTime = $state(0);
	let paused = $state(true);
	let muted = $state(false);
	let ended = $state(false);
	let started = $state(false);
	let fullscreen = $state(false);
	let rate = $state(1);
	let hover = $state<{ x: number; time: number; seg: number } | null>(null);

	/** Where to put the playhead once the next source has loaded (format / language / tutorial switch) */
	let pending: { time: number; play: boolean } | null = null;

	let Flip: typeof import('gsap/Flip').Flip | undefined;
	let reducedMotion = false;

	/** -1 intro, 0–9 numbered steps, 10 closing card */
	const current = $derived(currentTime >= c.outro ? 10 : c.steps.findLastIndex((s) => currentTime >= s));

	$effect(() => {
		active = started ? current : -1;
	});

	const stepEnd = (i: number) => c.steps[i + 1] ?? c.outro;
	const stepProgress = (i: number) => {
		const p = (currentTime - c.steps[i]) / (stepEnd(i) - c.steps[i]);
		return Math.min(Math.max(p, 0), 1);
	};

	/** The timeline as 12 segments: intro, steps 1–10, closing card */
	const segments = $derived(
		[0, ...c.steps, c.outro].map((start, i, list) => {
			const end = list[i + 1] ?? c.duration;
			const step = i >= 1 && i <= 10 ? info.steps[i - 1] : undefined;
			return {
				start,
				end,
				step,
				label: step ? `${m.tuto_step()} ${step.n} — ${step.title}` : i === 0 ? m.tuto_intro() : m.tuto_outro()
			};
		})
	);

	const pad = (n: number) => String(n).padStart(2, '0');

	async function play() {
		if (!video) return;
		started = true;
		ended = false;
		try {
			await video.play();
		} catch {
			// Blocked or interrupted (e.g. the source changed) — the play button stays available
		}
	}

	function toggle() {
		if (!video) return;
		if (video.paused) play();
		else video.pause();
	}

	function seek(time: number, autoplay = true) {
		if (!video) return;
		const t = Math.min(Math.max(time, 0), c.duration - 0.1);
		currentTime = t;
		if (video.readyState >= 1) video.currentTime = t;
		else pending = { time: t, play: autoplay };
		if (autoplay && (!started || video.paused)) play();
	}

	/** Swap the source while keeping the viewer's place. Runs inside the click so playback is still allowed. */
	function swap(change: () => void, time: number) {
		const wasPlaying = started && !paused;
		pending = started ? { time, play: wasPlaying } : null;
		ended = false;
		change();
		currentTime = started ? time : 0;
		flushSync();
		if (wasPlaying) play();
	}

	/** Play a step of the current tutorial (used by the step strip further down the page) */
	export function playStep(i: number) {
		seek(c.steps[i]);
	}

	/** Switch tutorial (from the hero cards or the end screen) and start it */
	export function select(id: TutorialId, autoplay = true) {
		if (id !== tutorial) {
			pending = { time: 0, play: autoplay };
			ended = false;
			currentTime = 0;
			tutorial = id;
			flushSync();
		}
		if (autoplay) {
			if (id === tutorial && ended) seek(0);
			else play();
		}
	}

	function setTutorial(id: TutorialId) {
		if (id === tutorial) return;
		swap(() => (tutorial = id), 0);
	}

	function setLang(next: VideoLang) {
		if (next === lang) return;
		// Narrations differ slightly in length: carry over the step, not the second
		const target = cut(tutorial, next, format);
		const time = current < 0 ? 0 : current >= 10 ? target.outro : target.steps[current];
		swap(() => (lang = next), time);
	}

	async function setFormat(next: VideoFormat) {
		if (next === format) return;
		const targets = stage?.querySelectorAll('[data-flip]');
		const state = Flip && !reducedMotion && targets ? Flip.getState(targets) : undefined;
		swap(() => (format = next), currentTime);
		await tick();
		if (state && Flip) {
			Flip.from(state, { duration: 0.8, ease: 'power3.inOut', scale: false, nested: true, prune: true });
		}
	}

	function setRate() {
		rate = speeds[(speeds.indexOf(rate) + 1) % speeds.length];
		if (video) video.defaultPlaybackRate = video.playbackRate = rate;
	}

	function onLoaded() {
		if (!video) return;
		video.defaultPlaybackRate = video.playbackRate = rate;
		if (pending) {
			video.currentTime = currentTime = pending.time;
			pending = null;
		}
	}

	function toggleFullscreen() {
		const el = player as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | undefined;
		const vid = video as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | undefined;
		if (document.fullscreenElement) document.exitFullscreen();
		else if (el?.requestFullscreen) el.requestFullscreen();
		else vid?.webkitEnterFullscreen?.(); // iPhone Safari
	}

	function prevStep() {
		// Like a music player: first press rewinds the step, a second one goes back a step
		if (current >= 0 && current <= 9 && currentTime - c.steps[current] > 1.5) seek(c.steps[current]);
		else if (current <= 0) seek(0);
		else seek(c.steps[Math.min(current, 10) - 1]);
	}

	function nextStep() {
		if (current < 9) seek(c.steps[current + 1]);
		else seek(c.outro);
	}

	function onKeydown(event: KeyboardEvent) {
		if ((event.target as HTMLElement).closest('input, button, a')) return;
		const keys: Record<string, () => void> = {
			' ': toggle,
			k: toggle,
			ArrowRight: () => seek(currentTime + 5),
			ArrowLeft: () => seek(currentTime - 5),
			n: nextStep,
			p: prevStep,
			m: () => (muted = !muted),
			f: toggleFullscreen
		};
		const action = keys[event.key];
		if (action) {
			event.preventDefault();
			action();
		}
	}

	function onTimelineMove(event: PointerEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
		const time = ratio * c.duration;
		hover = { x: ratio * 100, time, seg: segments.findLastIndex((s) => time >= s.start) };
	}

	// Keep the playing step in view inside the rail (scrolls the rail only, never the page)
	$effect(() => {
		const i = current;
		if (!rail || !started || i < 0 || i > 9) return;
		const item = rail.children[i] as HTMLElement | undefined;
		if (!item || rail.scrollHeight <= rail.clientHeight) return;
		rail.scrollTo({ top: item.offsetTop - rail.clientHeight / 2 + item.offsetHeight / 2, behavior: 'smooth' });
	});

	onMount(() => {
		reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Phones get the vertical cut by default
		if (matchMedia('(max-width: 767px)').matches) format = 'portrait';

		void (async () => {
			const { gsap } = await import('gsap');
			const mod = await import('gsap/Flip');
			gsap.registerPlugin(mod.Flip);
			Flip = mod.Flip;
		})();
	});
</script>

{#snippet glyph(kind: 'play' | 'pause')}
	<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true">
		{#if kind === 'play'}
			<path d="M7 4.6v14.8a1 1 0 0 0 1.5.86l12-7.4a1 1 0 0 0 0-1.72l-12-7.4A1 1 0 0 0 7 4.6Z" />
		{:else}
			<rect x="5.5" y="4" width="4.5" height="16" rx="1.2" /><rect x="14" y="4" width="4.5" height="16" rx="1.2" />
		{/if}
	</svg>
{/snippet}

{#snippet segmented(
	label: string,
	options: { value: string; label: string; icon?: string; flag?: string }[],
	value: string,
	onpick: (value: string) => void
)}
	<div class="tuto-seg" role="group" aria-label={label} style:--n={options.length} style:--i={options.findIndex((o) => o.value === value)}>
		{#each options as option (option.value)}
			<button type="button" aria-pressed={option.value === value} onclick={() => onpick(option.value)}>
				{#if option.flag}<img src={img(option.flag)} alt="" width="18" height="18" />{/if}
				{#if option.icon}<i class="ti {option.icon}" aria-hidden="true"></i>{/if}
				<span>{option.label}</span>
			</button>
		{/each}
	</div>
{/snippet}

<svelte:document onfullscreenchange={() => (fullscreen = document.fullscreenElement === player)} />

<div class="tuto-studio-area" id="watch">
	<div class="container mw-1690">
		<div class="tuto-studio-head">
			<div>
				<span class="top-title">{m.tuto_studio_top()}</span>
				<h2 class="tuto-studio-title">
					{#key tutorial}<span class="tuto-swap">{info.title}</span>{/key}
				</h2>
			</div>
			<div class="tuto-toolbar">
				<div class="tuto-tool">
					<span class="tuto-tool-label">{m.tuto_tutorial()}</span>
					{@render segmented(
						m.tuto_tutorial(),
						all.map((t) => ({ value: t.id, label: t.label, icon: t.id === 'deposit' ? 'ti-arrow-down' : 'ti-cash-banknote' })),
						tutorial,
						(v) => setTutorial(v as TutorialId)
					)}
				</div>
				<div class="tuto-tool">
					<span class="tuto-tool-label">{m.tuto_language()}</span>
					{@render segmented(
						m.tuto_language(),
						videoLangs.map((l) => ({ value: l, label: l.toUpperCase(), flag: flags[l] })),
						lang,
						(v) => setLang(v as VideoLang)
					)}
				</div>
				<div class="tuto-tool">
					<span class="tuto-tool-label">{m.tuto_format()}</span>
					{@render segmented(
						m.tuto_format(),
						videoFormats.map((f) => ({
							value: f,
							label: f === 'landscape' ? m.tuto_landscape() : m.tuto_portrait(),
							icon: f === 'landscape' ? 'ti-rectangle' : 'ti-rectangle-vertical'
						})),
						format,
						(v) => setFormat(v as VideoFormat)
					)}
				</div>
			</div>
		</div>

		<div class="tuto-stage is-{format}" bind:this={stage}>
			<!-- Focusable so the usual player shortcuts work: Space/K, ←/→ (5 s), N/P (steps), M, F -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
			<div
				class="tuto-player"
				class:playing={!paused}
				class:started
				data-flip="player"
				bind:this={player}
				tabindex="0"
				role="region"
				aria-label="{m.tuto_player_label()} — {info.title}"
				onkeydown={onKeydown}
			>
				<!-- Narration and on-screen text carry the content; no caption files yet -->
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					bind:this={video}
					ontimeupdate={() => (currentTime = video?.currentTime ?? 0)}
					onloadedmetadata={onLoaded}
					bind:paused
					bind:muted
					onended={() => (ended = true)}
					onclick={toggle}
					preload={started ? 'auto' : 'none'}
					poster={c.poster}
					playsinline
					src={c.src}
				></video>

				{#if !started}
					<button type="button" class="tuto-poster" onclick={play} aria-label="{m.tuto_watch()} — {info.title} ({clock(c.duration)})">
						<img src={c.poster} alt="" width={format === 'landscape' ? 1280 : 720} height={format === 'landscape' ? 720 : 1280} />
						<span class="tuto-poster-chips" aria-hidden="true">
							<span><img src={img(flags[lang])} alt="" width="14" height="14" /> {lang.toUpperCase()}</span>
							<span>{format === 'landscape' ? '16:9' : '9:16'}</span>
						</span>
						<span class="tuto-play" aria-hidden="true">{@render glyph('play')}</span>
						<span class="tuto-poster-label" aria-hidden="true">
							<strong>{m.tuto_watch()}</strong>
							<span>{clock(c.duration)}</span>
						</span>
					</button>
				{/if}

				{#if ended}
					<div class="tuto-end">
						<span class="tuto-end-check" aria-hidden="true"><i class="ti ti-check"></i></span>
						<p class="tuto-end-title">{m.tuto_end_title()}</p>
						<div class="tuto-end-actions">
							<button type="button" class="default-btn active" onclick={() => select(other.id)}>
								{other.id === 'deposit' ? m.tuto_end_other_deposit() : m.tuto_end_other_withdrawal()}
							</button>
							<button type="button" class="tuto-end-replay" onclick={() => seek(0)}>
								<i class="ti ti-rotate-clockwise"></i>
								{m.demo_replay()}
							</button>
						</div>
					</div>
				{/if}

				{#if started}
					<div class="tuto-controls">
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="tuto-timeline" onpointermove={onTimelineMove} onpointerleave={() => (hover = null)}>
							<div class="tuto-segments" aria-hidden="true">
								{#each segments as seg, i (i)}
									<span class="tuto-segment" class:is-step={!!seg.step} style:flex-grow={seg.end - seg.start}>
										<span
											style:transform="scaleX({Math.min(Math.max((currentTime - seg.start) / (seg.end - seg.start), 0), 1)})"
										></span>
									</span>
								{/each}
							</div>
							{#if hover}
								{@const seg = segments[hover.seg]}
								<div class="tuto-scrub" style:left="clamp(85px, {hover.x}%, calc(100% - 85px))" aria-hidden="true">
									{#if seg?.step}<img src={seg.step.thumb} alt="" width="96" height="96" />{/if}
									<span class="tuto-scrub-label">{seg?.label}</span>
									<span class="tuto-scrub-time">{clock(hover.time)}</span>
								</div>
							{/if}
							<input
								type="range"
								min="0"
								max={c.duration}
								step="0.1"
								value={currentTime}
								oninput={(event) => seek(Number(event.currentTarget.value))}
								aria-label={m.demo_seek()}
								aria-valuetext="{clock(currentTime)} / {clock(c.duration)} — {segments[current + 1]?.label}"
							/>
						</div>
						<div class="tuto-bar">
							<button type="button" onclick={toggle} aria-label={paused ? m.demo_play() : m.demo_pause()}>
								{@render glyph(paused ? 'play' : 'pause')}
							</button>
							<button type="button" class="tuto-bar-step" onclick={prevStep} aria-label={m.tuto_prev()}>
								<i class="ti ti-player-skip-back"></i>
							</button>
							<button type="button" class="tuto-bar-step" onclick={nextStep} aria-label={m.tuto_next()}>
								<i class="ti ti-player-skip-forward"></i>
							</button>
							<button type="button" onclick={() => (muted = !muted)} aria-label={muted ? m.demo_unmute() : m.demo_mute()}>
								<i class="ti {muted ? 'ti-volume-off' : 'ti-volume'}"></i>
							</button>
							<span class="tuto-time">{clock(currentTime)} <span>/ {clock(c.duration)}</span></span>
							<button type="button" class="tuto-rate ms-auto" onclick={setRate} aria-label="{m.tuto_speed()}: {rate}×">
								{rate}×
							</button>
							<button type="button" onclick={toggleFullscreen} aria-label={m.demo_fullscreen()}>
								<i class="ti {fullscreen ? 'ti-minimize' : 'ti-maximize'}"></i>
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- What's on screen right now, set large -->
			<div class="tuto-now" data-flip="now">
				<div class="tuto-now-num" aria-hidden="true">
					{#key `${tutorial}${current}${started}`}
						<span class="tuto-swap">
							{#if started && current >= 0 && current <= 9}
								{pad(current + 1)}
							{:else if started && current === 10}
								<i class="ti ti-headset"></i>
							{:else}
								<i class="ti {tutorial === 'deposit' ? 'ti-arrow-down' : 'ti-cash-banknote'}"></i>
							{/if}
						</span>
					{/key}
				</div>
				<div class="tuto-now-body">
					{#key `${tutorial}${current}${started}`}
						<div class="tuto-swap">
							{#if started && current >= 0 && current <= 9}
								<span class="tuto-now-kicker">{m.tuto_step()} {current + 1} / 10</span>
								<h3>{info.steps[current].title}</h3>
								{#if info.steps[current].note}<p>{info.steps[current].note}</p>{/if}
							{:else if started && current === 10}
								<span class="tuto-now-kicker">{m.tuto_outro()}</span>
								<h3>{m.tuto_help_contact()}</h3>
								<p>{m.tuto_safety()}</p>
							{:else}
								<span class="tuto-now-kicker">{started ? m.tuto_intro() : `${m.tuto_steps_count()} · ${clock(c.duration)}`}</span>
								<h3>{info.title}</h3>
								<p>{info.text}</p>
							{/if}
						</div>
					{/key}
					<div class="tuto-now-nav">
						<button type="button" onclick={prevStep} aria-label={m.tuto_prev()} disabled={!started}>
							<i class="ti ti-player-skip-back"></i>
						</button>
						<div class="tuto-dots" aria-hidden="true">
							{#each info.steps as step, i (step.n)}
								<span class:done={started && i < current}>
									<span style:transform="scaleX({started && i === current ? stepProgress(i) : 0})"></span>
								</span>
							{/each}
						</div>
						<button type="button" onclick={started ? nextStep : play} aria-label={m.tuto_next()}>
							<i class="ti ti-player-skip-forward"></i>
						</button>
					</div>
				</div>
			</div>

			<div class="tuto-rail" data-flip="rail">
				<p class="tuto-rail-title">
					<span><i class="ti ti-list-numbers"></i> {m.tuto_steps()}</span>
					<span class="tuto-rail-count">{started && current >= 0 ? Math.min(current + 1, 10) : 0}/10</span>
				</p>
				<ol bind:this={rail}>
					{#each info.steps as step, i (step.n)}
						<li>
							<button
								type="button"
								class:active={started && i === current}
								class:done={started && i < current}
								aria-current={started && i === current ? 'step' : undefined}
								onclick={() => playStep(i)}
							>
								<span class="tuto-rail-thumb">
									<img src={step.thumb} alt="" width="320" height="320" loading="lazy" />
									<span class="tuto-rail-n">{started && i < current ? '✓' : pad(step.n)}</span>
								</span>
								<span class="tuto-rail-text">
									<span class="tuto-rail-step">{step.title}</span>
									<span class="tuto-rail-time">{clock(c.steps[i])}</span>
								</span>
								<span class="tuto-rail-progress" aria-hidden="true">
									<span style:transform="scaleX({started && i === current ? stepProgress(i) : 0})"></span>
								</span>
							</button>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</div>
