<script lang="ts">
	import { contact as getContact, img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';

	const contact = getContact();
</script>

<div class="contact-us-area-three" id="contact">
	<div class="container mw-1690">
		<div class="bg-img ptb-120 rounded-5 position-relative z-1 px-4" style="background-image: url({img('choose-us-bg.jpg')});">
			<div class="text-center" data-cues="slideInUp" data-duration="900">
				<span class="top-title">{m.cta_top()}</span>
				<h2 class="main-title mw-1055 mx-auto">
					{m.cta_title_before()} <span class="under-line">{m.cta_title_highlight()}</span> {m.cta_title_after()}
				</h2>

				<div class="d-flex gap-30 flex-wrap justify-content-center mt-4">
					<a href={contact.appointmentHref} class="default-btn active">{m.cta_book()}</a>
					<a href={contact.emailHref} class="default-btn">{m.cta_contact()}</a>
				</div>
			</div>
		</div>
	</div>
</div>
