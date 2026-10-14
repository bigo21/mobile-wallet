<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<!-- Start Back To Up Area -->
<button
	type="button"
	id="backtotop"
	aria-label={m.back_to_top()}
	style:opacity={scrollY > 200 ? 1 : 0}
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
	<i class="ti ti-arrow-narrow-up"></i>
</button>
<!-- End Back To Up Area -->

