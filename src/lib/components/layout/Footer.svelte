<script lang="ts">
	import NewsletterForm from '#lib/components/NewsletterForm.svelte';
	import { contact as getContact, footerColumns, img, link, socials } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';

	const contact = getContact();
</script>

<!-- Start Footer Area -->
<div class="footer-area bg-dark-div ptb-120">
	<div class="container mw-1690">
		<div class="row g-4" data-cues="slideInUp" data-duration="900">
			<div class="col-lg-3 col-sm-6">
				<div class="footer-single-widget">
					<a href={link('/')} class="d-inline-block mb-4">
						<img src={img('logo-white.png')} class="brand-logo" alt="MobileWallet" />
					</a>

					<ul class="p-0 m-0 list-unstyled info-list">
						<li class="d-flex">
							<div class="flex-shrink-0">
								<i class="ti ti-map-pin-filled"></i>
							</div>
							<div class="flex-grow-1">
								<h6>{m.label_location()}</h6>
								<p>{contact.location}</p>
							</div>
						</li>
						<li class="d-flex">
							<div class="flex-shrink-0">
								<i class="ti ti-mail-filled"></i>
							</div>
							<div class="flex-grow-1">
								<h6>{m.label_email()}</h6>
								<a href={contact.emailHref}>{contact.email}</a>
							</div>
						</li>
					</ul>
				</div>
			</div>
			{#each footerColumns() as column (column.title)}
				<div class="col-lg-3 col-sm-6">
					<div class="footer-single-widget">
						<h3>{column.title}</h3>

						<ul class="import-link p-0 m-0 list-unstyled">
							{#each column.links as link (link.label)}
								<li>
									<a href={link.href}>{link.label}</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
			<div class="col-lg-3 col-sm-6">
				<div class="footer-single-widget newsletter-form">
					<h3>{m.footer_newsletter_title()}</h3>

					<p>{m.footer_newsletter_text()}</p>

					<NewsletterForm class="mb-3" />

					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="checkDefault" />
						<label class="form-check-label" for="checkDefault">
							{m.footer_consent()}
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- End Footer Area -->

<!-- Start CopyRight Area -->
<div class="copy-right-area">
	<div class="container mw-1690">
		<div class="d-flex flex-wrap gap-10 justify-content-center justify-content-lg-between align-items-center">
			<p class="mb-0"><span>{m.footer_copyright({ year: String(new Date().getFullYear()) })}</span> {m.footer_rights()}</p>

			<div class="d-flex flex-wrap gap-5 policy">
				{#each socials as social (social.href)}
					<a href={social.href} target="_blank" rel="noreferrer" class="text-decoration-none">{social.label}</a>
				{/each}
			</div>
		</div>
	</div>
</div>
<!-- End CopyRight Area -->
