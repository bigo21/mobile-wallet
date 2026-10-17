<script lang="ts">
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { demoChapters } from '#lib/data/home.ts';

	const chapters = demoChapters();
	const src = '/assets/videos/demo-video.mp4';

	let video = $state<HTMLVideoElement>();
	let player = $state<HTMLDivElement>();
	let currentTime = $state(0);
	// Known up front so the poster, timeline and chapter markers are right before the video loads
	let duration = $state(110.7);
	let paused = $state(true);
	let muted = $state(false);
	let ended = $state(false);
	let started = $state(false);
	let fullscreen = $state(false);

	const active = $derived(chapters.findLastIndex((chapter) => currentTime >= chapter.start));
	const progress = $derived(duration ? (currentTime / duration) * 100 : 0);

	const clock = (seconds: number) => {
		const s = Math.max(0, Math.floor(seconds));
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	};

	async function play() {
		if (!video) return;
		started = true;
		ended = false;
		try {
			await video.play();
		} catch {
			// Blocked or interrupted — leave the play button showing
		}
	}

	function toggle() {
		if (!video) return;
		if (video.paused) play();
		else video.pause();
	}

	function seek(time: number) {
		if (!video) return;
		currentTime = video.currentTime = Math.min(Math.max(time, 0), duration);
		if (!started || video.paused) play();
	}

	function toggleFullscreen() {
		const el = player as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | undefined;
		const vid = video as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | undefined;
		if (document.fullscreenElement) document.exitFullscreen();
		else if (el?.requestFullscreen) el.requestFullscreen();
		// iPhone Safari only supports fullscreen on the video element itself
		else vid?.webkitEnterFullscreen?.();
	}

	function onKeydown(event: KeyboardEvent) {
		// Leave keys alone when the timeline slider or a button has focus
		if ((event.target as HTMLElement).closest('input, button, a')) return;
		const keys: Record<string, () => void> = {
			' ': toggle,
			k: toggle,
			ArrowRight: () => seek(currentTime + 5),
			ArrowLeft: () => seek(currentTime - 5),
			m: () => (muted = !muted),
			f: toggleFullscreen
		};
		const action = keys[event.key];
		if (action) {
			event.preventDefault();
			action();
		}
	}
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

<svelte:document onfullscreenchange={() => (fullscreen = document.fullscreenElement === player)} />

<div class="demo-area ptb-120" id="demo">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.demo_top()}
			before={m.demo_title_before()}
			highlight={m.demo_title_highlight()}
			after={m.demo_title_after()}
			titleClass="mx-auto mw-720"
		/>
		<p class="demo-intro text-center mx-auto">
			{m.demo_text()}
			{#if m.demo_language_note()}
				<span class="demo-language"><i class="ti ti-language"></i> {m.demo_language_note()}</span>
			{/if}
		</p>

		<div class="row g-4 align-items-stretch">
			<div class="col-xl-8">
				<!-- Focusable so the usual player shortcuts work: Space/K, ←/→ (5 s), M, F -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
				<div
					class="demo-player"
					class:playing={!paused}
					class:started
					bind:this={player}
					tabindex="0"
					role="region"
					aria-label={m.demo_player_label()}
					onkeydown={onKeydown}
				>
					<!-- No caption file yet: the narration is in French, with on-screen labels for each step -->
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						bind:this={video}
						ontimeupdate={() => (currentTime = video?.currentTime ?? 0)}
						onloadedmetadata={() => {
							if (video && Number.isFinite(video.duration)) duration = video.duration;
						}}
						bind:paused
						bind:muted
						onended={() => (ended = true)}
						onclick={toggle}
						preload="none"
						playsinline
						{src}
					></video>

					{#if !started}
						<button type="button" class="demo-poster" onclick={play} aria-label="{m.demo_watch()} ({clock(duration)})">
							<img
								src={img('demo-poster-1280.webp')}
								srcset="{img('demo-poster-640.webp')} 640w, {img('demo-poster-1280.webp')} 1280w"
								sizes="(min-width: 1200px) 66vw, 100vw"
								width="1280"
								height="720"
								alt=""
								loading="lazy"
							/>
							<span class="demo-play" aria-hidden="true">{@render glyph('play')}</span>
							<span class="demo-poster-label" aria-hidden="true">
								<strong>{m.demo_watch()}</strong>
								<span>{clock(duration)}</span>
							</span>
						</button>
					{/if}

					{#if ended}
						<div class="demo-end">
							<p class="demo-end-title">{m.demo_end_title()}</p>
							<div class="d-flex flex-wrap justify-content-center gap-15">
								<button type="button" class="default-btn active" data-bs-toggle="modal" data-bs-target="#presentationModal">
									{m.presentation_cta()}
								</button>
								<button type="button" class="default-btn" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
									{m.header_get_in_touch()}
								</button>
							</div>
							<button type="button" class="demo-replay" onclick={() => seek(0)}>
								<i class="ti ti-rotate-clockwise"></i>
								{m.demo_replay()}
							</button>
						</div>
					{/if}

					{#if started}
						<div class="demo-controls">
							<div class="demo-timeline">
								<div class="demo-timeline-track" aria-hidden="true">
									<span class="demo-timeline-fill" style:width="{progress}%"></span>
									{#each chapters.slice(1) as chapter (chapter.start)}
										<span class="demo-timeline-mark" style:left="{(chapter.start / duration) * 100}%"></span>
									{/each}
								</div>
								<input
									type="range"
									min="0"
									max={duration}
									step="0.1"
									value={currentTime}
									oninput={(event) => seek(Number(event.currentTarget.value))}
									aria-label={m.demo_seek()}
									aria-valuetext="{clock(currentTime)} / {clock(duration)} — {chapters[active]?.title}"
								/>
							</div>
							<div class="demo-bar">
								<button type="button" onclick={toggle} aria-label={paused ? m.demo_play() : m.demo_pause()}>
									{@render glyph(paused ? 'play' : 'pause')}
								</button>
								<button type="button" onclick={() => (muted = !muted)} aria-label={muted ? m.demo_unmute() : m.demo_mute()}>
									<i class="ti {muted ? 'ti-volume-off' : 'ti-volume'}"></i>
								</button>
								<span class="demo-time">{clock(currentTime)} <span>/ {clock(duration)}</span></span>
								<span class="demo-current-chapter">{chapters[active]?.title}</span>
								<button type="button" class="ms-auto" onclick={toggleFullscreen} aria-label={m.demo_fullscreen()}>
									<i class="ti {fullscreen ? 'ti-minimize' : 'ti-maximize'}"></i>
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<div class="col-xl-4">
				<div class="demo-chapters">
					<p class="demo-chapters-title"><i class="ti ti-list-numbers"></i> {m.demo_chapters()}</p>
					<ol>
						{#each chapters as chapter, i (chapter.start)}
							<li>
								<button
									type="button"
									class:active={started && i === active}
									class:done={started && i < active}
									aria-current={started && i === active ? 'step' : undefined}
									onclick={() => seek(chapter.start)}
								>
									<span class="demo-chapter-index">{String(i + 1).padStart(2, '0')}</span>
									<span class="demo-chapter-title">{chapter.title}</span>
									<span class="demo-chapter-time">{clock(chapter.start)}</span>
								</button>
							</li>
						{/each}
					</ol>
				</div>
			</div>
		</div>
	</div>
</div>
