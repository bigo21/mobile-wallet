<script lang="ts">
	import { flattenLinks, img, languages, link, navigation as getNavigation } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale, setLocale } from '#lib/paraglide/runtime.js';

	const navigation = getNavigation();
	let openLabel = $state<string | null>(null);

	function toggle(event: MouseEvent, label: string) {
		event.preventDefault();
		openLabel = openLabel === label ? null : label;
	}
</script>

<div class="mobile-navbar offcanvas offcanvas-end border-0" tabindex="-1" id="offcanvasExample">
	<div class="offcanvas-header">
		<div>
			<a href={link('/')} class="logo d-inline-block">
				<img src={img('logo.png')} class="brand-logo brand-logo-sm" alt="MobileWallet" />
			</a>
			<a href={link('/')} class="logo d-none">
				<img src={img('logo-white.png')} class="brand-logo brand-logo-sm" alt="MobileWallet" />
			</a>
		</div>

		<button type="button" class="btn-close opacity-1" data-bs-dismiss="offcanvas" aria-label={m.close()}>
			<i class="ti ti-x"></i>
		</button>
	</div>

	<div class="offcanvas-body">
		<ul class="mobile-menu">
			{#each navigation as item (item.label)}
				{#if item.children}
					<li class="mobile-menu-list" class:active={openLabel === item.label}>
						<a href="#!" onclick={(event) => toggle(event, item.label)}>{item.label}</a>
						<ul class="mobile-menu-items">
							{#each flattenLinks(item.children) as link (link.href)}
								<li>
									<a class="dropdown-item" href={link.href}>{link.label}</a>
								</li>
							{/each}
						</ul>
					</li>
				{:else}
					<li class="mobile-menu-list without-icon border-bottom">
						<a href={item.href} class="nav-link">{item.label}</a>
					</li>
				{/if}
			{/each}
		</ul>

		<div class="d-flex gap-10 mt-4" role="group" aria-label={m.language_label()}>
			{#each languages as language (language.locale)}
				<button
					type="button"
					class="default-btn py-2 px-3 d-flex align-items-center gap-10"
					class:active={language.locale === getLocale()}
					lang={language.locale}
					onclick={() => setLocale(language.locale)}
				>
					<img src={img(language.flag)} alt="" width="20" />
					{language.label}
				</button>
			{/each}
		</div>
	</div>
</div>
