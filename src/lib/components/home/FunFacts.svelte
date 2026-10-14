<script lang="ts">
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { funFacts } from '#lib/data/home.ts';
</script>

<div class="fun-fact-area ptb-120" id="market">
	<div class="container mw-1690">
		<span class="partner-title text-center d-block mb-50 mt-0 text-secondary" data-cue="slideInLeft" data-duration="900">
			{m.market_title()}
		</span>
		<div class="row g-4" data-cues="slideInUp" data-duration="900">
			{#each funFacts() as fact (fact.label)}
				<div class="col-xxl-3 col-md-6">
					<div class="fun-fact-single-item h-100 d-flex flex-column gap-15 mw-100">
						<div class="d-flex align-items-center justify-content-center justify-content-xxl-start gap-20">
							<img src={img(fact.image)} alt="fun-fact" />
							<h2>{fact.value}<span>{fact.suffix}</span></h2>
						</div>
						<p class="text-secondary text-center text-xxl-start mb-0">{fact.label}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
