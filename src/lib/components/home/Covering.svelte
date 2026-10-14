<script lang="ts">
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { countries } from '#lib/data/home.ts';
</script>

<div class="covering-area-two ptb-120 bg-img" style="background-image: url({img('choose-us-bg.jpg')});">
	<div class="container mw-1690 position-relative z-1">
		<SectionHeading
			topTitle={m.roadmap_top()}
			before={m.roadmap_title_before()}
			highlight={m.roadmap_title_highlight()}
			after={m.roadmap_title_after()}
			titleClass="mx-auto mw-620"
		/>
		<div class="row g-4 justify-content-center" data-cues="slideInUp" data-duration="900">
			{#each countries() as country (country.title)}
				<div class="col-xl-3 col-md-6">
					<div class="covering-single-item bg-white h-100 d-flex flex-column">
						<div class="d-flex align-items-center gap-25 mb-4">
							<div class="flex-shrink-0">
								<img src={img(country.image)} alt={country.alt} />
							</div>
							<div class="flex-grow-1">
								<h3 class="mb-0">{country.title}</h3>
							</div>
						</div>
						<p class="flex-grow-1">{country.text}</p>

						<a href={link('/#contact')} class="read-more align-self-start">{country.link}</a>
					</div>
				</div>
			{/each}
		</div>

		<img src={img('shape11.png')} class="position-absolute top-0 start-0 d-none d-lg-inline-block z-n1" alt="shape11" />
		<img src={img('shape11.png')} class="position-absolute bottom-0 end-0 d-none d-lg-inline-block z-n1" alt="shape11" />
	</div>
</div>
