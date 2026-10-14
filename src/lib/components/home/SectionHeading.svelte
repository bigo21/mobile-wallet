<script lang="ts">
	/**
	 * The "top title + headline with an underlined word" heading used across the home page.
	 * With `button` it renders the two-column variant (heading left, call-to-action right).
	 */
	let {
		topTitle,
		before,
		highlight,
		after,
		titleClass = 'mx-auto',
		rowClass = 'g-4 mb-50 align-items-center',
		cues = true,
		button
	}: {
		topTitle: string;
		before: string;
		highlight: string;
		after: string;
		titleClass?: string;
		rowClass?: string;
		/** Animate in with scrollCue */
		cues?: boolean;
		button?: { label: string; href: string };
	} = $props();
</script>

{#snippet heading()}
	<span class="top-title">{topTitle}</span>
	<h2 class="main-title {titleClass}">{before} <span class="under-line">{highlight}</span> {after}</h2>
{/snippet}

{#if button}
	<div class="row {rowClass}" data-cues={cues ? 'slideInUp' : undefined} data-duration={cues ? 900 : undefined}>
		<div class="col-lg-6">
			{@render heading()}
		</div>
		<div class="col-lg-6">
			<div class="d-flex justify-content-lg-end">
				<a href={button.href} class="default-btn">{button.label}</a>
			</div>
		</div>
	</div>
{:else}
	<div class="text-center mb-50 mt-0" data-cues={cues ? 'slideInUp' : undefined} data-duration={cues ? 900 : undefined}>
		{@render heading()}
	</div>
{/if}
