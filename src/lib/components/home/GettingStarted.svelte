<script lang="ts">
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { plans } from '#lib/data/home.ts';
</script>

<div class="getting-started-area-three bg-dark-div ptb-120" id="plans">
	<div class="container mw-1690">
		<span class="partner-title text-center d-block mb-60 mt-0 text-white" data-cue="slideInLeft" data-duration="900">
			{m.plans_title()}
		</span>
		<div class="row g-4" data-cues="slideInUp" data-duration="900">
			{#each plans() as step, i (step.title)}
				<div class="col-lg-4">
					<div class="features-single-item2 style-three p-0 bg-transparent rounded-0">
						<div class="icon">
							<div class="d-flex justify-content-between align-items-center">
								<img src={img(step.image)} alt="getting{i + 1}" />
								<span class="step">{m.plan_label({ number: String(i + 1).padStart(2, '0') })}</span>
							</div>
						</div>

						<h3 class="text-white">{step.title}</h3>
						<p class="text-white">{step.text}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="presentation-cta text-center">
			<button type="button" class="default-btn active d-inline-flex align-items-center gap-10" data-bs-toggle="modal" data-bs-target="#presentationModal">
				<i class="ti ti-file-text"></i>
				{m.presentation_cta()}
			</button>
		</div>
	</div>
</div>
