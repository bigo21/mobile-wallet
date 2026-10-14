<script lang="ts">
	import ExperienceBadge from '#lib/components/home/ExperienceBadge.svelte';
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { faqs } from '#lib/data/home.ts';
</script>

<div class="faq-area-three pt-120" id="faq">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.faq_top()}
			before={m.faq_title_before()}
			highlight={m.faq_title_highlight()}
			after=""
			titleClass="mw-720 ms-0"
			button={{ label: m.faq_cta(), href: link('/#contact') }}
		/>

		<div class="row g-4">
			<div class="col-lg-6">
				<div class="accordion faq-wrapper style-three me-xl-5 pe-xl-4" id="faqAccordion" data-cues="slideInUp" data-duration="900">
					{#each faqs() as faq, i (faq.question)}
						{@const id = `faq-${i}`}
						<div class="accordion-item">
							<h2 class="accordion-header">
								<button
									class="accordion-button text-secondary collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#{id}"
									aria-expanded="false"
									aria-controls={id}
								>
									{faq.question}
								</button>
							</h2>
							<div {id} class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
								<div class="accordion-body">
									{#each faq.answer.split('\n\n') as paragraph (paragraph)}
										<p>{paragraph}</p>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="col-lg-6">
				<div class="faq-img-three position-relative z-1">
					<img
						src={img('faq-img2-1000.webp')}
						srcset="{img('faq-img2-600.webp')} 600w, {img('faq-img2-1000.webp')} 1000w"
						sizes="(min-width: 992px) 50vw, 100vw"
						width="1000"
						height="852"
						class="d-block w-100 h-auto mx-auto"
						alt={m.faq_img_alt()}
						loading="lazy"
					/>
					<ExperienceBadge value="24/7">{m.faq_badge_line_1()} <br /> {m.faq_badge_line_2()}</ExperienceBadge>
				</div>
			</div>
		</div>
	</div>
</div>
