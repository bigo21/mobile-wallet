<script lang="ts">
	import { interestLabel, interests, type Interest } from '#lib/forms.ts';

	let { data } = $props();

	const typeLabels = { contact: 'Contact', presentation: 'Présentation', documentation: 'Documentation' } as const;
	const typeBadges = { contact: 'text-bg-info', presentation: 'text-bg-warning', documentation: 'text-bg-success' } as const;

	const total = $derived(data.counts.contact + data.counts.presentation + data.counts.documentation);
	const tabs = $derived([
		{ type: null, label: 'Tous', count: total },
		...(['contact', 'presentation', 'documentation'] as const).map((type) => ({ type, label: typeLabels[type], count: data.counts[type] }))
	]);

	const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Africa/Douala' });
	const interest = (value: string | null) =>
		value && interests.includes(value as Interest) ? interestLabel(value as Interest, 'fr') : value;
</script>

<main class="container-fluid py-4 px-3 px-md-4">
	<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
		{#each tabs as tab (tab.type)}
			<a href={tab.type ? `/admin?type=${tab.type}` : '/admin'} class="btn btn-sm {data.type === tab.type ? 'btn-dark' : 'btn-outline-secondary bg-white'}">
				{tab.label} ({tab.count})
			</a>
		{/each}
		<a href={data.type ? `/admin/export?type=${data.type}` : '/admin/export'} class="btn btn-sm btn-primary ms-auto" data-sveltekit-reload>
			Export CSV
		</a>
	</div>

	{#if data.dbError}
		<div class="alert alert-danger">Impossible de charger les leads : la base de données est injoignable ou DATABASE_URL n'est pas configurée.</div>
	{/if}

	<div class="table-responsive bg-white rounded shadow-sm">
		<table class="table table-sm table-hover align-top mb-0">
			<thead class="table-light">
				<tr>
					<th>Date</th>
					<th>Type</th>
					<th>Nom</th>
					<th>Email</th>
					<th>Société</th>
					<th>Téléphone</th>
					<th>Pays</th>
					<th>Intérêt</th>
					<th>Message</th>
					<th>Langue</th>
					<th>PDF</th>
					<th title="Téléchargements suivis par l'ancien site">Téléch.</th>
				</tr>
			</thead>
			<tbody>
				{#each data.leads as lead (lead.id)}
					<tr>
						<td class="text-nowrap text-secondary">{date.format(lead.created_at)}</td>
						<td><span class="badge {typeBadges[lead.type]}">{typeLabels[lead.type]}</span></td>
						<td class="text-nowrap fw-semibold">{lead.name}</td>
						<td class="text-nowrap"><a href="mailto:{lead.email}">{lead.email}</a></td>
						<td>{lead.company ?? '—'}</td>
						<td class="text-nowrap">{lead.phone ?? '—'}</td>
						<td>{lead.country ?? '—'}</td>
						<td>{interest(lead.interest) ?? '—'}</td>
						<td class="message">{lead.message ?? '—'}</td>
						<td class="text-uppercase">{lead.lang}</td>
						<td class="text-uppercase">{lead.doc_lang ?? '—'}</td>
						<td>{lead.type === 'contact' ? '—' : lead.download_count ? `${lead.download_count}×` : '—'}</td>
					</tr>
				{:else}
					<tr><td colspan="12" class="text-center text-secondary py-5">Aucun lead pour ce filtre.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>

<style>
	.message {
		min-width: 240px;
		max-width: 360px;
		white-space: pre-line;
	}
</style>
