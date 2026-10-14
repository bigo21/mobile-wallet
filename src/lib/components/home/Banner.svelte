<script lang="ts">
	import { counter } from '#lib/actions.ts';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { bannerStats } from '#lib/data/home.ts';
</script>

<div class="banner-area style-two bg-img pt-120" style="background-image: url({img('banner-bg2.jpg')});">
	<div class="container mw-1690 position-relative z-1">
		<div class="banner-content mw-1240 mx-auto text-center" data-cues="slideInUp" data-group="images" data-duration="900">
			<span class="top-title">{m.hero_top()}</span>
			<h1>{m.hero_title_before()} <span class="under-line">{m.hero_title_highlight()}</span> {m.hero_title_after()}</h1>
		</div>

		<div class="banner-content-three">
			<div class="row g-4 justify-content-center" data-cues="slideInUp" data-group="images" data-duration="900">
				<div class="col-xl-4 col-sm-6">
					<p class="text-secondary">
						{m.hero_text()}
					</p>
					<a href={link('/#plans')} class="default-btn">{m.hero_cta()}</a>

					<div class="d-flex flex-wrap align-items-center clients gap-20">
						<div class="d-flex">
							<!-- Portraits from Unsplash (free Unsplash License) -->
							{#each ['clients/client-1.webp', 'clients/client-2.webp', 'clients/client-3.webp'] as client (client)}
								<img src={img(client)} class="rounded-circle border-white border" width="55" height="55" alt="" />
							{/each}
						</div>
						<div>
							<span class="fs-18 d-block mb-2 text-secondary"><span class="fw-semibold">{m.hero_roi_bold()}</span> {m.hero_roi_rest()}</span>
							<div class="d-flex gap-1">
								{#each { length: 5 }, i (i)}
									<i class="ti ti-star-filled fs-20 text-warning2 lh-1"></i>
								{/each}
								<span class="fs-18 position-relative ms-2 text-secondary" style="top: -2px;"> {m.hero_roi_note()}</span>
							</div>
						</div>
					</div>
				</div>

				<div class="col-xl-6 col-sm-6 order-3 order-xxl-2">
					<div class="banner-img transform-unset text-center">
						<img src={img('banner-img2.png')} alt={m.hero_img_alt()} />
					</div>
				</div>

				<div class="col-xl-2 col-sm-6 order-2 order-xxl-3">
					<div class="d-sm-flex justify-content-end">
						<div>
							{#each bannerStats() as stat (stat.label)}
								<div class="fun-fact-single-item">
									<h2><span class="counter" use:counter={stat.value}>{stat.value}</span>{stat.suffix}</h2>
									<p class="text-secondary">{stat.label}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
