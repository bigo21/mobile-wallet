<script lang="ts">
	import { onMount } from 'svelte';
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { partners } from '#lib/data/home.ts';

	let container: HTMLDivElement;

	onMount(() => {
		let swiper: import('swiper').Swiper | undefined;
		let destroyed = false;

		void (async () => {
			const { Swiper } = await import('swiper');
			const { Autoplay } = await import('swiper/modules');
			if (destroyed) return;

			swiper = new Swiper(container, {
				modules: [Autoplay],
				slidesPerView: 1,
				spaceBetween: 30,
				preventClicks: true,
				autoHeight: true,
				autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
				breakpoints: {
					0: { slidesPerView: 2 },
					475: { slidesPerView: 3 },
					768: { slidesPerView: 4 },
					992: { slidesPerView: 5 },
					1200: { slidesPerView: 6 }
				}
			});
		})();

		return () => {
			destroyed = true;
			swiper?.destroy();
		};
	});
</script>

<div class="partner-area ptb-120">
	<div class="container mw-1690">
		<span class="partner-title text-center d-block mb-50 mt-0 text-secondary" data-cue="slideInLeft" data-duration="900">
			{m.partners_title()}
		</span>
		<div class="swiper partner-slide2 text-center" bind:this={container}>
			<div class="swiper-wrapper align-items-center">
				<!-- Listed twice so autoplay has enough slides to move through on wide screens -->
				{#each [...partners, ...partners] as partner, i (i)}
					<div class="swiper-slide">
						<img src={img(partner.image)} alt={partner.name} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
