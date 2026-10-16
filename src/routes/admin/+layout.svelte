<script lang="ts">
	import { page } from '$app/state';
	import { img } from '#lib/data/site.ts';

	let { children } = $props();
</script>

<svelte:head>
	<title>Leads — MobileWallet</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="admin">
	<header class="admin-header">
		<a href="/admin"><img src={img('logo-white.png')} alt="MobileWallet" height="34" /></a>
		<span class="admin-title">Leads</span>
		{#if page.route.id !== '/admin/login'}
			<form method="POST" action="/admin?/logout" class="ms-auto">
				<button class="btn btn-sm btn-outline-light">Se déconnecter</button>
			</form>
		{/if}
	</header>

	{@render children()}
</div>

<style>
	.admin {
		min-height: 100vh;
		background: #f4f5f7;
		font-size: 14px;
	}
	.admin-header {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 24px;
		background: #0b2a3b;
	}
	.admin-title {
		color: #a9c6d3;
		font-size: 16px;
	}
</style>
