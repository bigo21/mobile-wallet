<script lang="ts">
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { roiCards } from '#lib/data/home.ts';

	const cards = roiCards();
	const fastest = Math.min(...cards.map((card) => card.years));
	const number = new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 });

	// French uses the singular below 2 ("1,25 an"), English only for exactly 1
	const years = (value: number) =>
		(getLocale() === 'fr' ? value < 2 : value === 1) ? m.roi_year({ value: number.format(value) }) : m.roi_years({ value: number.format(value) });
</script>

<div class="blog-area-three ptb-120 bg-img" style="background-image: url({img('choose-us-bg.jpg')});">
	<div class="container mw-1690 position-relative z-1">
		<SectionHeading
			topTitle={m.roi_top()}
			before={m.roi_title_before()}
			highlight={m.roi_title_highlight()}
			after={m.roi_title_after()}
		/>
		<div class="row g-4" data-cues="slideInUp" data-duration="900">
			{#each cards as card, i (card.title)}
				<div class="col-xl-3 col-md-6">
					<div class="roi-card" class:featured={card.featured}>
						<div class="d-flex flex-wrap align-items-center justify-content-between gap-10 mb-4">
							<span class="roi-tag">
								<i class="ti {card.multi ? 'ti-arrows-shuffle' : 'ti-arrow-right'}"></i>
								{card.multi ? m.roi_multi() : m.roi_single()}
							</span>
							{#if card.badge}
								<span class="roi-badge"><i class="ti ti-star-filled"></i> {card.badge}</span>
							{:else}
								<span class="roi-index">{String(i + 1).padStart(2, '0')}</span>
							{/if}
						</div>

						<h3>{card.title}</h3>
						<p class="roi-text">{card.text}</p>

						<div class="roi-metric">
							<span class="roi-label">{m.roi_payback()}</span>
							<span class="roi-value">{years(card.years)}</span>
						</div>

						<div class="roi-speed">
							<div class="d-flex justify-content-between">
								<span class="roi-label">{m.roi_speed()}</span>
								<span class="roi-label">{Math.round((fastest / card.years) * 100)}%</span>
							</div>
							<div class="roi-bar"><span style:width="{(fastest / card.years) * 100}%"></span></div>
						</div>

						<div class="roi-revenue d-flex align-items-center justify-content-between gap-10">
							<span class="roi-label">{m.roi_revenue()}</span>
							<strong>{number.format(card.revenue)} M XAF</strong>
						</div>

						<a href={link('/#contact')} class="default-btn roi-btn">{m.roi_cta()}</a>
					</div>
				</div>
			{/each}
		</div>

		<img src={img('shape11.png')} class="position-absolute top-0 start-0 d-none d-lg-inline-block z-n1" alt="shape11" />
		<img src={img('shape11.png')} class="position-absolute bottom-0 end-0 d-none d-lg-inline-block z-n1" alt="shape11" />
	</div>
</div>
