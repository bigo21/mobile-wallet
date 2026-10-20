<script lang="ts">
	import * as v from 'valibot';
	import { contact as getContact, img, languages } from '#lib/data/site.ts';
	import { fieldErrors, presentationSchema } from '#lib/forms.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';

	const contact = getContact();
	const schema = presentationSchema();

	type Field = 'name' | 'email';
	const empty = () => ({ name: '', email: '', language: getLocale() });

	let values = $state(empty());
	let errors = $state<Partial<Record<Field, string>>>({});
	let attempted = $state(false);
	let status = $state<'idle' | 'sending' | 'sent' | 'error' | 'rate_limited'>('idle');
	let sentTo = $state('');
	let modal: HTMLDivElement;

	function validate() {
		const result = v.safeParse(schema, values);
		errors = fieldErrors(result);
		return result;
	}

	$effect(() => {
		if (attempted) validate();
	});

	// Start fresh every time the modal is closed
	$effect(() => {
		const reset = () => {
			values = empty();
			attempted = false;
			errors = {};
			status = 'idle';
		};
		modal.addEventListener('hidden.bs.modal', reset);
		return () => modal.removeEventListener('hidden.bs.modal', reset);
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		attempted = true;
		const result = validate();
		if (!result.success) {
			const first = Object.keys(errors)[0];
			if (first) document.getElementById(`presentation-${first}`)?.focus();
			return;
		}

		status = 'sending';
		try {
			const response = await fetch('/api/presentation', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...result.output, locale: getLocale() })
			});
			if (response.ok) sentTo = result.output.email;
			status = response.ok ? 'sent' : response.status === 429 ? 'rate_limited' : 'error';
		} catch {
			status = 'error';
		}
	}
</script>

<div class="modal fade presentation-modal" id="presentationModal" tabindex="-1" aria-labelledby="presentationModalTitle" aria-hidden="true" bind:this={modal}>
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<button type="button" class="presentation-close" data-bs-dismiss="modal" aria-label={m.close()}>
				<i class="ti ti-x"></i>
			</button>

			<img src={img('logo.png')} class="presentation-logo" alt="MobileWallet" />

			{#if status === 'sent'}
				<div class="form-success" role="status">
					<span class="form-success-icon"><i class="ti ti-mail-check"></i></span>
					<h2 class="presentation-title" id="presentationModalTitle">{m.presentation_success_title()}</h2>
					<p class="presentation-text">{m.presentation_success_text({ email: sentTo })}</p>
					<button type="button" class="presentation-submit" data-bs-dismiss="modal">{m.close()}</button>
				</div>
			{:else}
				<h2 class="presentation-title" id="presentationModalTitle">{m.presentation_title()}</h2>
				<p class="presentation-text">{m.presentation_text()}</p>

				<form novalidate onsubmit={submit}>
					<div class="presentation-field">
						<label for="presentation-name">{m.presentation_name()}</label>
						<input
							id="presentation-name"
							type="text"
							class="form-control"
							class:is-invalid={errors.name}
							autocomplete="name"
							placeholder={m.presentation_name_placeholder()}
							aria-invalid={!!errors.name}
							aria-describedby={errors.name ? 'presentation-name-error' : undefined}
							bind:value={values.name}
						/>
						{#if errors.name}
							<div class="invalid-feedback d-block" id="presentation-name-error">{errors.name}</div>
						{/if}
					</div>

					<div class="presentation-field">
						<label for="presentation-email">{m.presentation_email()}</label>
						<input
							id="presentation-email"
							type="email"
							class="form-control"
							class:is-invalid={errors.email}
							autocomplete="email"
							placeholder={m.presentation_email_placeholder()}
							aria-invalid={!!errors.email}
							aria-describedby={errors.email ? 'presentation-email-error' : undefined}
							bind:value={values.email}
						/>
						{#if errors.email}
							<div class="invalid-feedback d-block" id="presentation-email-error">{errors.email}</div>
						{/if}
					</div>

					<fieldset class="presentation-field">
						<legend>{m.presentation_language()}</legend>
						<div class="presentation-languages">
							<!-- French first, as in the brief -->
							{#each [...languages].reverse() as language (language.locale)}
								<label class="presentation-language" class:active={values.language === language.locale}>
									<input type="radio" name="presentation-language" value={language.locale} bind:group={values.language} />
									{language.label}
								</label>
							{/each}
						</div>
					</fieldset>

					{#if status === 'error' || status === 'rate_limited'}
						<div class="form-alert" role="alert">
							<i class="ti ti-alert-circle"></i>
							<span>{status === 'rate_limited' ? m.form_rate_limited() : m.form_error({ email: contact.email })}</span>
						</div>
					{/if}
					<button type="submit" class="presentation-submit" disabled={status === 'sending'}>
						{#if status === 'sending'}
							{m.form_sending()}
						{:else}
							{m.presentation_submit()} <i class="ti ti-arrow-right"></i>
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
