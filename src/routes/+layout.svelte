<script lang="ts">
	import 'swiper/css';
	import '@tabler/icons-webfont/dist/tabler-icons.min.css';
	import '#lib/styles/britti-sans-trial.css';
	import '#lib/styles/scrollCue.css';
	import '#lib/scss/style.scss';

	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import FloatingControls from '#lib/components/layout/FloatingControls.svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Header from '#lib/components/layout/Header.svelte';
	import MobileNav from '#lib/components/layout/MobileNav.svelte';
	import PresentationModal from '#lib/components/PresentationModal.svelte';
	import SidebarInfo from '#lib/components/layout/SidebarInfo.svelte';
	import { m } from '#lib/paraglide/messages.js';

	let { children } = $props();

	// The admin pages have their own layout, without the site's header, footer and overlays
	const admin = $derived(page.route.id?.startsWith('/admin') ?? false);

	let scrollCue: typeof import('#lib/vendor/scrollCue.js').default | undefined;

	onMount(() => {
		let lenis: import('lenis').default | undefined;

		void (async () => {
			// Bootstrap's data API (dropdowns, offcanvas, modal, collapse) binds on import
			await import('bootstrap');

			const { default: Lenis } = await import('lenis');
			lenis = new Lenis({ duration: 0.75, smoothWheel: true, autoRaf: true });

			scrollCue = (await import('#lib/vendor/scrollCue.js')).default;
			scrollCue.init({ percentage: 0.9 });
			// scrollCue only checks visibility on `load` and `scroll`; `load` has already fired by now,
			// so reveal whatever is on screen straight away (first visit, refresh mid-page, #anchor links)
			scrollCue.update();
		})();

		return () => {
			lenis?.destroy();
		};
	});

	afterNavigate(async ({ from }) => {
		if (!from) return;
		scrollCue?.update();

		// Overlays don't close themselves on client-side navigation
		const { Offcanvas, Modal } = await import('bootstrap');
		document.querySelectorAll('.offcanvas.show').forEach((el) => Offcanvas.getInstance(el)?.hide());
		document.querySelectorAll('.modal.show').forEach((el) => Modal.getInstance(el)?.hide());
	});
</script>

<svelte:head>
	{#if !admin}
		<title>{m.meta_title()}</title>
	{/if}
</svelte:head>

{#if admin}
	{@render children()}
{:else}
	<Header />
	<MobileNav />
	<SidebarInfo />
	<PresentationModal />

	{@render children()}

	<Footer />
	<FloatingControls />
{/if}

<style>
	/* Keep anchored sections clear of the fixed header */
	:global(div[id]) {
		scroll-margin-top: 100px;
	}
</style>
