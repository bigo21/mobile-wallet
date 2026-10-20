<script lang="ts">
	import * as v from 'valibot';
	import PhoneInput from '#lib/components/PhoneInput.svelte';
	import { contact as getContact } from '#lib/data/site.ts';
	import { contactSchema, fieldErrors, interestLabel, interests, type Interest } from '#lib/forms.ts';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';

	const contact = getContact();
	const schema = contactSchema();

	type Field = keyof v.InferInput<typeof schema>;
	const empty = () => ({ name: '', email: '', company: '', phone: '', interest: interests[0] as Interest, message: '' });

	let values = $state(empty());
	let errors = $state<Partial<Record<Field, string>>>({});
	// Errors only show after the first submit attempt, then update as the visitor types
	let attempted = $state(false);
	let status = $state<'idle' | 'sending' | 'sent' | 'error' | 'rate_limited'>('idle');

	function validate() {
		const result = v.safeParse(schema, values);
		errors = fieldErrors(result);
		return result;
	}

	$effect(() => {
		if (attempted) validate();
	});

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		attempted = true;
		const result = validate();
		if (!result.success) {
			const first = Object.keys(errors)[0];
			if (first) document.getElementById(`contact-${first}`)?.focus();
			return;
		}

		status = 'sending';
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...result.output, locale: getLocale() })
			});
			status = response.ok ? 'sent' : response.status === 429 ? 'rate_limited' : 'error';
		} catch {
			status = 'error';
		}
	}

	function reset() {
		values = empty();
		attempted = false;
		errors = {};
		status = 'idle';
	}
</script>

{#snippet error(field: Field)}
	{#if errors[field]}
		<div class="invalid-feedback d-block" id="contact-{field}-error">{errors[field]}</div>
	{/if}
{/snippet}

{#if status === 'sent'}
	<div class="form-success" role="status">
		<span class="form-success-icon"><i class="ti ti-check"></i></span>
		<h4>{m.contact_success_title()}</h4>
		<p>{m.contact_success_text()}</p>
		<button type="button" class="default-btn" onclick={reset}>{m.contact_success_again()}</button>
	</div>
{:else}
	<form class="contact-form" novalidate onsubmit={submit}>
		<div class="row g-3">
			<div class="col-12">
				<label class="form-label" for="contact-name">{m.contact_name()}</label>
				<input
					id="contact-name"
					type="text"
					class="form-control"
					class:is-invalid={errors.name}
					autocomplete="name"
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? 'contact-name-error' : undefined}
					bind:value={values.name}
				/>
				{@render error('name')}
			</div>
			<div class="col-12">
				<label class="form-label" for="contact-email">{m.label_email()}</label>
				<input
					id="contact-email"
					type="email"
					class="form-control"
					class:is-invalid={errors.email}
					autocomplete="email"
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? 'contact-email-error' : undefined}
					bind:value={values.email}
				/>
				{@render error('email')}
			</div>
			<div class="col-12">
				<label class="form-label" for="contact-company">{m.contact_company()}</label>
				<input
					id="contact-company"
					type="text"
					class="form-control"
					class:is-invalid={errors.company}
					autocomplete="organization"
					aria-invalid={!!errors.company}
					aria-describedby={errors.company ? 'contact-company-error' : undefined}
					bind:value={values.company}
				/>
				{@render error('company')}
			</div>
			<div class="col-12">
				<label class="form-label" for="contact-phone">{m.contact_phone()}</label>
				<PhoneInput
					id="contact-phone"
					bind:value={values.phone}
					invalid={!!errors.phone}
					describedby={errors.phone ? 'contact-phone-error' : undefined}
				/>
				{@render error('phone')}
			</div>
			<div class="col-12">
				<label class="form-label" for="contact-interest">{m.contact_interest()}</label>
				<select id="contact-interest" class="form-select" class:is-invalid={errors.interest} bind:value={values.interest}>
					{#each interests as option (option)}
						<option value={option}>{interestLabel(option)}</option>
					{/each}
				</select>
				{@render error('interest')}
			</div>
			<div class="col-12">
				<label class="form-label" for="contact-message">{m.contact_message()}</label>
				<textarea
					id="contact-message"
					class="form-control"
					class:is-invalid={errors.message}
					rows="4"
					aria-invalid={!!errors.message}
					aria-describedby={errors.message ? 'contact-message-error' : undefined}
					bind:value={values.message}
				></textarea>
				{@render error('message')}
			</div>
			<div class="col-12">
				{#if status === 'error' || status === 'rate_limited'}
					<div class="form-alert" role="alert">
						<i class="ti ti-alert-circle"></i>
						<span>{status === 'rate_limited' ? m.form_rate_limited() : m.form_error({ email: contact.email })}</span>
					</div>
				{/if}
				<button type="submit" class="default-btn w-100" disabled={status === 'sending'}>
					{status === 'sending' ? m.form_sending() : m.contact_submit()}
				</button>
			</div>
		</div>
	</form>
{/if}
