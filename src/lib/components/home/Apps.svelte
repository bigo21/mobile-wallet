<script lang="ts">
	import { reveal } from '#lib/actions.ts';
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { softwareFeatures as getSoftwareFeatures } from '#lib/data/home.ts';

	const softwareFeatures = getSoftwareFeatures();
</script>

<div class="apps-area ptb-120" id="solutions">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.software_top()}
			before={m.software_title_before()}
			highlight={m.software_title_highlight()}
			after={m.software_title_after()}
			titleClass="mw-100"
			rowClass="g-4 mb-50 align-items-center"
			cues={false}
			button={{ label: m.software_cta_plans(), href: link('/#plans') }}
		/>
		<div class="row g-4">
			<div class="col-lg-6">
				<div class="apps-content me-xl-5 pe-xl-4 position-relative">
					<div data-cues="slideInUp" data-duration="900">
						<p>
							{m.software_text()}
						</p>

						<div class="position-relative z-1 app-for-border">
							<ul class="px-0 m-0 list-unstyled">
								{#each softwareFeatures as feature, i (feature)}
									<li class="d-flex align-items-center gap-12" class:mb-lg-4={i < softwareFeatures.length - 1} class:mb-3={i < softwareFeatures.length - 1}>
										<img src={img('check2.svg')} alt="check2" />
										<span class="fs-18 text-secondary">{feature}</span>
									</li>
								{/each}
							</ul>
							<img src={img('shape11.png')} class="position-absolute top-50 end-0 translate-middle-y shape4 d-none d-xl-inline-block" alt="shape11" />
						</div>

						<div class="d-flex gap-30">
							<a href={link('/#contact')} class="default-btn active">{m.software_demo()}</a>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-6 overflow-hidden">
				<div class="apps-img h-100 reveal" use:reveal>
					<img src={img('apps-img3.png')} class="object-fit-cover h-100 rounded-5" alt={m.software_img_alt()} />
				</div>
			</div>
		</div>
	</div>
</div>
