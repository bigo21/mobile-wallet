<script lang="ts">
	import { reveal } from '#lib/actions.ts';
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { chooseUsLeft, chooseUsRight } from '#lib/data/home.ts';
</script>

{#snippet reasons(items: { title: string; text: string }[])}
	<div class="choose-us-content-three">
		{#each items as item (item.title)}
			<div class="d-flex choose-us-single-item-three">
				<div class="flex-shrink-0">
					<img src={img('check.svg')} alt="check" />
				</div>
				<div class="flex-grow-1">
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<div class="choose-us-area bg-img ptb-120" style="background-image: url({img('choose-us-bg.jpg')});">
	<div class="container mw-1690 position-relative z-1">
		<SectionHeading
			topTitle={m.choose_top()}
			before={m.choose_title_before()}
			highlight={m.choose_title_highlight()}
			after={m.choose_title_after()}
			cues={false}
		/>
		<div class="row align-items-center g-4" data-cues="slideInUp" data-duration="900">
			<div class="col-lg-4 col-md-6">
				{@render reasons(chooseUsLeft())}
			</div>
			<div class="col-lg-4 col-md-12 order-3 order-lg-2">
				<div class="text-center reveal" use:reveal>
					<img src={img('choose-us-img2.png')} alt={m.choose_img_alt()} />
				</div>
			</div>
			<div class="col-lg-4 col-md-6 order-2 order-lg-3">
				{@render reasons(chooseUsRight())}
			</div>
		</div>
		<img src={img('shape11.png')} class="position-absolute top-0 start-0 d-none d-lg-inline-block" alt="shape11" />
		<img src={img('shape11.png')} class="position-absolute top-0 end-0 mt-5 d-none d-lg-inline-block" alt="shape11" />
	</div>
</div>
