<script lang="ts">
	import SectionHeading from '#lib/components/home/SectionHeading.svelte';
	import { img } from '#lib/data/site.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { team } from '#lib/data/home.ts';

	const flagUrls = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', { query: '?url&no-inline', import: 'default', eager: true });
	const flag = (code: string) => flagUrls[`/node_modules/country-flag-icons/3x2/${code}.svg`];
	const countryName = new Intl.DisplayNames([getLocale()], { type: 'region' });
	const initials = (name: string) =>
		name
			.split(/\s+/)
			.map((part) => part[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();

	const members = team();
	// Staggered rows of 4 / 3 / 2 on large screens; one wrapping list below that
	const rows = [members.slice(0, 4), members.slice(4, 7), members.slice(7)];

	/** One cut-out per photo, drawn in a 0–1 box so it scales with the card */
	const shapes = [
		// notched top-right corner
		'M.05 0H.62Q.67 0 .67.05V.13Q.67.18 .72.18H.95Q1 .18 1 .23V.95Q1 1 .95 1H.05Q0 1 0 .95V.05Q0 0 .05 0Z',
		// cut top-left corner
		'M.2 0H.96Q1 0 1 .04V.96Q1 1 .96 1H.04Q0 1 0 .96V.18Z',
		// cut top-right corner
		'M.04 0H.8L1 .2V.96Q1 1 .96 1H.04Q0 1 0 .96V.04Q0 0 .04 0Z',
		// wavy left edge
		'M.22 .02C.45-.02 .7.04 .97.02V1H.04C.13.9-.02.82.06.72S-.02.53.06.44-.02.25.06.16C.1.08.15.04.22.02Z',
		// soft blob
		'M.16.07C.32-.01.5.06.66.02.86-.02 1 .1.95.3.9.45 1.02.55.95.72.9.85.98.94.88 1H.07C-.02.9.08.8.03.65-.02.5.08.4.03.25 0 .15.06.11.16.07Z',
		// cloud
		'M.04 1C-.03.86.08.75.02.6-.04.45.1.35.08.25.06.12.2.04.32.11.38 0 .56-.02.63.08.73 0 .91.02.93.15 1.02.22.95.35 1 .45 1.05.6.92.7.98.82 1.02.92.96 1 .96 1Z',
		// stepped bottom-right
		'M.03 0H.97Q1 0 1 .03V.6H.88V.74H.76V.88H.6V1H.03Q0 1 0 .97V.03Q0 0 .03 0Z',
		// quarter arch
		'M0 0H.45A.55.55 0 0 1 1 .55V1H0Z',
		// dome
		'M0 .97V.32Q0 .26.07.26H.2Q.22 0 .5 0T.8.26H.93Q1 .26 1 .32V.97Q1 1 .97 1H.03Q0 1 0 .97Z'
	];
</script>

<!-- Clip paths for the photo shapes -->
<svg width="0" height="0" class="position-absolute" aria-hidden="true">
	<defs>
		{#each shapes as d, i (i)}
			<clipPath id="team-shape-{i}" clipPathUnits="objectBoundingBox"><path {d} /></clipPath>
		{/each}
	</defs>
</svg>

<div class="team-arch-area ptb-120" id="team">
	<div class="container mw-1690">
		<SectionHeading
			topTitle={m.team_top()}
			before={m.team_title_before()}
			highlight={m.team_title_highlight()}
			after={m.team_title_after()}
			titleClass="mx-auto mw-720"
		/>
		<p class="team-arch-intro text-center mx-auto">{m.team_text()}</p>

		<div class="team-arch-grid position-relative">
			<!-- The ribbon running behind the lower rows -->
			<svg class="team-arch-ribbon" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
				<path d="M10 400C120 320 170 210 300 230S420 360 520 330 640 160 760 230 900 330 1010 250 1130 120 1190 125" />
			</svg>

			{#each rows as row, r (r)}
				<div class="team-arch-row">
					{#each row as member, i (member.name)}
						{@const index = rows.slice(0, r).reduce((total, previous) => total + previous.length, 0) + i}
						<div class="team-arch-card">
							<div class="team-arch-photo" style:clip-path="url(#team-shape-{index % shapes.length})">
								{#if member.image}
									<img src={img(member.image)} alt={member.name} loading="lazy" />
								{:else}
									<span class="team-arch-initials" aria-hidden="true">{initials(member.name)}</span>
								{/if}
							</div>
							<div class="team-arch-tag">
								<span class="team-arch-country">
									<img src={flag(member.country)} alt="" width="18" height="12" />
									{countryName.of(member.country)}
								</span>
								<h3>{member.name}</h3>
								<span class="team-arch-role">{member.role}</span>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
