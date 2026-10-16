<script lang="ts">
	let { form } = $props();
</script>

<div class="login card mx-auto">
	<form method="POST" class="card-body p-4">
		<h1 class="h5 mb-3">Accès administrateur</h1>
		<label for="password" class="form-label">Mot de passe</label>
		<!-- svelte-ignore a11y_autofocus -->
		<input id="password" name="password" type="password" class="form-control" required autofocus autocomplete="current-password" />
		{#if form?.error}
			<p class="text-danger small mt-2 mb-0">{form.error}</p>
		{/if}
		<button class="btn btn-dark w-100 mt-3">Se connecter</button>
	</form>
</div>

<style>
	.login {
		max-width: 380px;
		margin-top: 12vh;
	}
</style>
