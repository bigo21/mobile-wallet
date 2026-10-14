<script lang="ts">
	import { img } from '#lib/data/site.ts';
	import { marqueeItems as getMarqueeItems } from '#lib/data/home.ts';

	const marqueeItems = getMarqueeItems();
</script>

<div class="ptb-100 bg-dark-div">
	<div class="marquee-wrapper monogram-wrap style-two">
		<div class="marquee speed-300">
			<!-- The list is rendered twice so the scrolling loop is seamless -->
			{#each [0, 1] as copy (copy)}
				{#each marqueeItems as item, i (item)}
					<span class="monogram">{item}</span>
					{#if i < marqueeItems.length - 1}
						<span class="monogram">
							<img src={img('star.png')} alt="star" />
						</span>
					{/if}
				{/each}
			{/each}
		</div>
	</div>
</div>
