<script lang="ts">
	import ExperienceBadge from '#lib/components/home/ExperienceBadge.svelte';
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { hardwareModels } from '#lib/data/home.ts';
</script>

<div class="about-us-area-three pt-120" id="about">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.about_top()}
			before={m.about_title_before()}
			highlight={m.about_title_highlight()}
			after={m.about_title_after()}
			titleClass="mw-650 ms-0"
			button={{ label: m.about_cta(), href: link('/#contact') }}
		/>

		<div class="row g-4" data-cues="slideInUp" data-duration="900">
			<div class="col-lg-6">
				<div class="about-us-img-three position-relative z-1">
					<img src={img('about-img3.png')} class="w-100 h-auto" alt={m.about_img_alt()} />
					<ExperienceBadge value="07">{m.about_badge()}</ExperienceBadge>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="about-content-two">
					<p>
						{m.about_text()}
					</p>

					<div class="position-relative z-1">
						<ul class="px-0 list-unstyled">
							{#each hardwareModels() as item (item)}
								<li class="d-flex align-items-center gap-12">
									<img src={img('check2.svg')} alt="check2" />
									<span class="fs-18 text-secondary">{item}</span>
								</li>
							{/each}
						</ul>
						<img src={img('shape11.png')} class="position-absolute top-50 end-0 translate-middle-y" alt="shape" />
					</div>

					<div class="d-flex align-items-center gap-30 transfer-single-item">
						<div class="flex-shrink-0">
							<img src={img('about-icon.png')} alt="about-icon" />
						</div>
						<div class="flex-grow-1">
							<h3 class="mb-0">{m.about_vision_title()}</h3>
						</div>
					</div>

					<p>
						{m.about_vision_text()}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
