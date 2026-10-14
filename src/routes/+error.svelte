<script lang="ts">
	import { page } from '$app/state';
	import { link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{page.status} - MobileWallet</title>
</svelte:head>

<div class="error-area ptb-120" style="padding-top: 260px;">
	<div class="container mw-1690">
		<div class="error-content text-center mw-650 mx-auto">
			<h1>{page.status}</h1>
			<h3>{page.status === 404 ? m.error_not_found() : m.error_generic()}</h3>
			<p>{page.error?.message}</p>
			<a href={link('/')} class="default-btn active">{m.error_back()}</a>
		</div>
	</div>
</div>
