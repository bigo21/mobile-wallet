<script lang="ts">
	import ContactForm from '#lib/components/ContactForm.svelte';
	import { img, link } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
</script>

<div class="offcanvas offcanvas-end sidebar-info bg-gray" tabindex="-1" id="offcanvasRight" aria-labelledby="contactSidebarTitle">
	<div class="offcanvas-header border-bottom">
		<a href={link('/')} class="footer-logo d-block">
			<img src={img('logo.png')} class="logo brand-logo brand-logo-sm" alt="MobileWallet" />
			<img src={img('logo-white.png')} class="white-logo brand-logo brand-logo-sm d-none" alt="MobileWallet" />
		</a>

		<button type="button" class="btn-close p-0 mt-0 me-0" data-bs-dismiss="offcanvas" aria-label={m.close()}>
			<i class="ti ti-x"></i>
		</button>
	</div>
	<div class="offcanvas-body">
		<div class="sidebar-single-item">
			<h3 class="sidebar-contact-title" id="contactSidebarTitle">{m.contact_form_title()}</h3>
			<p class="sidebar-contact-intro">{m.contact_form_intro()}</p>

			<ContactForm />
		</div>
	</div>
</div>
