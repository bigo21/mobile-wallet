<script lang="ts">
	import type { Snippet } from 'svelte';
	import { img } from '#lib/data/site.ts';

	let { value, class: className = '', children }: { value: string; class?: string; children: Snippet } = $props();
</script>

<div class="experience {className}">
	<div class="d-flex align-items-center gap-20">
		<div class="flex-shrink-0">
			<div class="d-flex gap-10 align-items-center">
				<img src={img('check3.svg')} alt="check3" />
				<h2 class="mb-0">{value}</h2>
			</div>
		</div>
		<div class="flex-grow-1">
			<span>{@render children()}</span>
		</div>
	</div>
</div>
