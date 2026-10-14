<script lang="ts">
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { operatorLogos } from '#lib/data/home.ts';
</script>

<div class="pay-support-area ptb-120">
	<div class="container mw-1690">
		<span class="partner-title text-center mb-50 d-block text-secondary" data-cues="slideInUp" data-duration="900">
			{m.operators_title()}
		</span>
		<div class="operator-logos" data-cues="slideInUp" data-duration="900">
			{#each operatorLogos as logo (logo.image)}
				<div class="operator-logo">
					<img src={img(logo.image)} alt={logo.alt} />
				</div>
			{/each}
		</div>
	</div>
</div>
