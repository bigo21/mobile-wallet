<script lang="ts">
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';

	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- No backend is wired up yet — submitting just keeps the user on the page -->
<form class="position-relative z-1 {className}" onsubmit={(event) => event.preventDefault()}>
	<input type="email" class="form-control" placeholder={m.newsletter_placeholder()} aria-label={m.label_email()} required />
	<button type="submit" class="submit-btn position-absolute top-50 end-0 translate-middle-y" aria-label={m.newsletter_subscribe()}>
		<img src={img('icon-send.svg')} alt="icon-send" />
	</button>
</form>
