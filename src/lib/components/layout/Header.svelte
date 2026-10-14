<script lang="ts">
	import { page } from '$app/state';
	import {
		contact as getContact,
		img,
		isGroup,
		languages,
		link,
		navigation as getNavigation,
		socials,
		type NavGroup,
		type NavLink
	} from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { deLocalizeHref, deLocalizeUrl, getLocale, setLocale } from '#lib/paraglide/runtime.js';

	const contact = getContact();
	const navigation = getNavigation();
	const currentLanguage = languages.find((l) => l.locale === getLocale()) ?? languages[0];

	let scrollY = $state(0);
	const sticky = $derived(scrollY >= 200);

	const isActive = (item: NavLink | NavGroup): boolean =>
		isGroup(item)
			? (item.children ?? []).some(isActive)
			: deLocalizeHref(item.href ?? '') === deLocalizeUrl(page.url.href).pathname;
</script>

<svelte:window bind:scrollY />

{#snippet dropdownItems(items: (NavLink | NavGroup)[])}
	{#each items as item (item.label)}
		<li>
			{#if isGroup(item)}
				<a
					class="dropdown-item sub-dropdown dropdown-toggle"
					class:active={isActive(item)}
					href="#!"
					role="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					{item.label}
				</a>
				<ul class="dropdown-menu">
					{@render dropdownItems(item.children ?? [])}
				</ul>
			{:else}
				<a class="dropdown-item" class:active={isActive(item)} href={item.href}>{item.label}</a>
			{/if}
		</li>
	{/each}
{/snippet}

<div class="fixed-top unset-for-mobile">
	<!-- Start Header Area -->
	<div class="header-area bg-dark-div">
		<div class="container mw-1690">
			<div class="row align-items-center gy-2">
				<div class="col-lg-3 col-md-6">
					<div class="d-flex justify-content-center justify-content-md-start link-social-wrap align-items-center">
						<div class="d-flex link">
							<a href={link('/#contact')}>{m.topbar_support()}</a>
							<a href={link('/#faq')}>{m.topbar_help()}</a>
						</div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6">
					<ul class="d-flex flex-wrap justify-content-center flex-lg-nowrap align-items-center p-0 m-0 list-unstyled header-info">
						<li class="d-flex align-items-center gap-10">
							<span class="fw-bold">{m.label_location()}:</span>
							<span class="text-nowrap">{contact.locationShort}</span>
						</li>
						<li class="d-flex align-items-center gap-10">
							<span class="fw-bold">{m.label_email()}:</span>
							<a href={contact.emailHref} class="text-decoration-none">{contact.email}</a>
						</li>
					</ul>
				</div>
				<div class="col-lg-3">
					<div class="d-flex link-social-wrap align-items-center justify-content-center justify-content-lg-end">
						<div class="social-link d-flex align-items-center">
							{#each socials as social (social.href)}
								<a href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
									<i class="ti {social.icon}"></i>
								</a>
							{/each}
						</div>

						<div class="dropdown language">
							<button
								class="btn btn-secondary bg-transparent border-0 gap-10 d-flex align-items-center p-0"
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
								aria-label={m.language_label()}
							>
								<img src={img(currentLanguage.flag)} alt="" width="24" height="24" />
								{currentLanguage.label}
							</button>
							<ul class="dropdown-menu">
								{#each languages as language (language.locale)}
									<li>
										<!-- setLocale navigates to the same page in the chosen language -->
										<button
											type="button"
											class="dropdown-item d-flex align-items-center gap-10 fs-15 fw-normal py-2"
											class:active={language.locale === currentLanguage.locale}
											lang={language.locale}
											onclick={() => setLocale(language.locale)}
										>
											<img src={img(language.flag)} alt="" width="20" height="20" />
											{language.label}
										</button>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End Header Area -->

	<!-- Start Navbar Area -->
	<nav class="navbar navbar-expand-lg bg-transparent" class:sticky id="navbar">
		<div class="container mw-1690">
			<div class="d-flex align-items-center">
				<a class="navbar-brand me-100" href={link('/')}>
					<img src={img('logo.png')} class="main-logo brand-logo" alt="MobileWallet" />
					<img src={img('logo-white.png')} class="white-logo brand-logo d-none" alt="MobileWallet" />
				</a>
			</div>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav">
					{#each navigation as item (item.label)}
						<li class="nav-item dropdown">
							{#if item.children}
								<a
									class="nav-link dropdown-toggle"
									class:active={isActive(item)}
									href="#!"
									role="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									{item.label}
								</a>
								<ul class="dropdown-menu">
									{@render dropdownItems(item.children)}
								</ul>
							{:else}
								<a class="nav-link" class:active={isActive(item)} href={item.href}>{item.label}</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>

			<div class="others-options d-flex align-items-center">
				<button type="button" class="default-btn active d-none d-sm-inline-block" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
					<div class="d-flex align-items-center gap-10">{m.header_get_in_touch()}</div>
				</button>
				<button type="button" class="bg-transparent border-0 p-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" aria-label={m.open_contact_form()}>
					<img src={img('icon-grid.svg')} alt="icon-grid" />
				</button>
				<a class="navbar-toggler" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" aria-label={m.header_open_menu()}>
					<span class="burger-menu">
						<span class="top-bar"></span>
						<span class="middle-bar"></span>
						<span class="bottom-bar"></span>
					</span>
				</a>
			</div>
		</div>
	</nav>
	<!-- End Navbar Area -->
</div>
