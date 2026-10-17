<script lang="ts">
	import { m } from '#lib/paraglide/messages.js';
	import AboutUs from '#lib/components/home/AboutUs.svelte';
	import Apps from '#lib/components/home/Apps.svelte';
	import Banner from '#lib/components/home/Banner.svelte';
	import Blog from '#lib/components/home/Blog.svelte';
	import ChooseUs from '#lib/components/home/ChooseUs.svelte';
	import ContactCta from '#lib/components/home/ContactCta.svelte';
	import VideoDemo from '#lib/components/home/VideoDemo.svelte';
	import Covering from '#lib/components/home/Covering.svelte';
	import Faq from '#lib/components/home/Faq.svelte';
	import FunFacts from '#lib/components/home/FunFacts.svelte';
	import GettingStarted from '#lib/components/home/GettingStarted.svelte';
	import Marquee from '#lib/components/home/Marquee.svelte';
	import Partners from '#lib/components/home/Partners.svelte';
	import PaySupport from '#lib/components/home/PaySupport.svelte';
	import Team from '#lib/components/home/Team.svelte';
</script>

<svelte:head>
	<title>{m.meta_title()}</title>
	<meta name="description" content={m.meta_description()} />
</svelte:head>

<Banner />
<Marquee />
<AboutUs />
<Partners />
<Team />
<ChooseUs />
<VideoDemo />
<GettingStarted />
<Faq />
<FunFacts />
<Covering />
<PaySupport />
<Blog />
<Apps />
<ContactCta />
