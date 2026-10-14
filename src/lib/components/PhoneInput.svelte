<script lang="ts">
	import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
	import { tick, untrack } from 'svelte';
	import { m } from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';

	let {
		id,
		value = $bindable(''),
		defaultCountry = 'CM',
		invalid = false,
		describedby
	}: {
		id: string;
		/** The number in E.164 format (e.g. +237671234567), or '' when empty */
		value?: string;
		defaultCountry?: CountryCode;
		invalid?: boolean;
		describedby?: string;
	} = $props();

	// Each flag is its own small SVG file, only downloaded when it is shown
	const flagUrls = import.meta.glob<string>('/node_modules/country-flag-icons/3x2/*.svg', { query: '?url&no-inline', import: 'default', eager: true });
	const flag = (code: CountryCode) => flagUrls[`/node_modules/country-flag-icons/3x2/${code}.svg`];

	const regionNames = new Intl.DisplayNames([getLocale()], { type: 'region' });
	const options = getCountries()
		.map((code) => ({ code, name: regionNames.of(code) ?? code, dial: `+${getCountryCallingCode(code)}` }))
		.sort((a, b) => a.name.localeCompare(b.name, getLocale()));

	// Only the starting country comes from the prop; the visitor changes it from there
	let country = $state<CountryCode>(untrack(() => defaultCountry));
	let display = $state('');
	let open = $state(false);
	let search = $state('');
	let active = $state(0);

	let root: HTMLDivElement;
	let input: HTMLInputElement;
	let searchInput = $state<HTMLInputElement>();
	let list = $state<HTMLUListElement>();

	const filtered = $derived.by(() => {
		const query = search.trim().toLowerCase();
		if (!query) return options;
		return options.filter((o) => o.name.toLowerCase().includes(query) || o.dial.includes(query) || o.code.toLowerCase() === query);
	});

	const digitsOf = (text: string) => text.replace(/\D/g, '');

	/** Formats the digits for display and works out the E.164 value */
	function update(digits: string, international: boolean) {
		if (international) {
			const formatter = new AsYouType();
			display = digits ? formatter.input(`+${digits}`) : '+';
			const detected = formatter.getCountry();
			if (detected) country = detected;
			value = digits ? `+${digits}` : '';
		} else {
			display = new AsYouType(country).input(digits);
			// Keeps the national prefix rules (e.g. France's leading 0) out of the stored number
			value = digits ? (parsePhoneNumberFromString(digits, country)?.number ?? `+${getCountryCallingCode(country)}${digits}`) : '';
		}
	}

	async function onInput(event: Event & { currentTarget: HTMLInputElement }) {
		const el = event.currentTarget;
		const raw = el.value;
		const caret = el.selectionStart ?? raw.length;
		const international = raw.trimStart().startsWith('+');
		let digits = digitsOf(raw);
		let digitsBeforeCaret = digitsOf(raw.slice(0, caret)).length;

		// Backspace over a space or bracket: remove the digit in front of it instead
		if (event instanceof InputEvent && event.inputType === 'deleteContentBackward' && digits === digitsOf(display) && digitsBeforeCaret > 0) {
			digits = digits.slice(0, digitsBeforeCaret - 1) + digits.slice(digitsBeforeCaret);
			digitsBeforeCaret--;
		}

		update(digits, international);

		// Put the caret back after the same number of digits
		await tick();
		// Never before a leading "+", or the next digit would land in front of it
		let position = display.startsWith('+') ? 1 : 0;
		for (let seen = 0; position < display.length && seen < digitsBeforeCaret; position++) {
			if (/\d/.test(display[position])) seen++;
		}
		input.setSelectionRange(position, position);
	}

	async function toggle() {
		open = !open;
		if (open) {
			search = '';
			active = Math.max(0, options.findIndex((o) => o.code === country));
			await tick();
			searchInput?.focus();
			scrollActiveIntoView();
		}
	}

	function close(focusButton = false) {
		open = false;
		if (focusButton) root.querySelector<HTMLButtonElement>('.phone-country-btn')?.focus();
	}

	function select(code: CountryCode) {
		country = code;
		// Re-read what was typed so far for the new country
		const typed = digitsOf(display.startsWith('+') ? '' : display);
		update(typed, false);
		close();
		input.focus();
	}

	async function scrollActiveIntoView() {
		await tick();
		list?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
	}

	function onSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			active = Math.min(active + 1, filtered.length - 1);
			scrollActiveIntoView();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			active = Math.max(active - 1, 0);
			scrollActiveIntoView();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (filtered[active]) select(filtered[active].code);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation(); // don't close the sidebar too
			close(true);
		}
	}

	// Svelte delegates keydown to the document, which is too late to stop Bootstrap's offcanvas
	// from also closing on Escape — so this listener goes on the search field directly
	$effect(() => {
		const el = searchInput;
		if (!el) return;
		el.addEventListener('keydown', onSearchKeydown);
		return () => el.removeEventListener('keydown', onSearchKeydown);
	});

	function onWindowPointerDown(event: PointerEvent) {
		if (open && !root.contains(event.target as Node)) close();
	}
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

<div class="phone-input" class:is-invalid={invalid} bind:this={root}>
	<div class="phone-input-control">
		<button
			type="button"
			class="phone-country-btn"
			aria-label="{m.phone_country_label()}: {regionNames.of(country)}"
			aria-haspopup="listbox"
			aria-expanded={open}
			onclick={toggle}
		>
			<span class="phone-flag"><img src={flag(country)} alt="" /></span>
			<i class="ti ti-selector"></i>
		</button>
		<input
			bind:this={input}
			{id}
			type="tel"
			inputmode="tel"
			class="phone-number"
			autocomplete="tel"
			placeholder={m.phone_placeholder()}
			value={display}
			aria-invalid={invalid}
			aria-describedby={describedby}
			oninput={onInput}
		/>
	</div>

	{#if open}
		<div class="phone-country-popover">
			<div class="phone-country-search">
				<i class="ti ti-search"></i>
				<input
					bind:this={searchInput}
					type="text"
					placeholder={m.phone_search()}
					aria-label={m.phone_search()}
					aria-controls="{id}-countries"
					bind:value={search}
					oninput={() => (active = 0)}
				/>
			</div>
			<ul class="phone-country-list" id="{id}-countries" role="listbox" bind:this={list}>
				{#each filtered as option, i (option.code)}
					<li
						role="option"
						aria-selected={option.code === country}
						data-index={i}
						class:active={i === active}
						onpointermove={() => (active = i)}
						onclick={() => select(option.code)}
						onkeydown={(event) => event.key === 'Enter' && select(option.code)}
					>
						<span class="phone-flag"><img src={flag(option.code)} alt="" loading="lazy" /></span>
						<span class="phone-country-name">{option.name}</span>
						<span class="phone-country-dial">{option.dial}</span>
						<i class="ti ti-check" class:invisible={option.code !== country}></i>
					</li>
				{:else}
					<li class="phone-country-empty">{m.phone_no_country()}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
