<script lang="ts" context="module">
</script>

<script lang="ts">
	import type { InputFieldOptions, InputFieldType } from '../../FormCreator/types/fieldTypes';
	import {
		addressValueSchema,
		choiceOptionSchema,
		type AddressValueSchema,
		type ChoiceOptionSchema,
		type EntryValueType
	} from '../types/entryTypes';

	export let name: string;
	export let hint = '';
	export let value: EntryValueType | EntryValueType[];
	export let type: InputFieldType;
	export let options: InputFieldOptions = {};

	let addressSearchValue = '';
	let error = '';

	const isString = (value: unknown): value is string => typeof value === 'string';
	const isNumber = (value: unknown): value is number => typeof value === 'number';
	const isArray = (value: unknown): value is EntryValueType[] => Array.isArray(value);
	const isObject = (value: unknown): value is Record<string, unknown> =>
		typeof value === 'object' && value !== null && !isArray(value);
	const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
	const isAddress = (value: unknown): value is AddressValueSchema => {
		return addressValueSchema.safeParse(value).success;
	};

	const hasChoiceOptions = (options: unknown): options is ChoiceOptionSchema => {
		return choiceOptionSchema.safeParse(options).success;
	};
</script>

<div class="card bg-surface-50-900-token flex items-center justify-between space-y-1 p-4">
	<div class="basis-1/2">
		<h5 class="h5 inline font-bold">{name}</h5>
		<span class="text-surface-400-500-token text-sm italic">{hint}</span>
	</div>

	<div class="basis-1/2">
		{#if type === 'text' && isString(value)}
			<input type="text" bind:value class="input variant-outline-surface w-full" />
		{:else if type === 'number' && isNumber(value)}
			<input
				class="input variant-outline-surface w-full"
				type="text"
				on:input={(e) => {
					const inputValue = e.currentTarget.value;

					if (inputValue === '') {
						error = '';
						return;
					}

					const parsed = Number(value);
					if (isNaN(parsed)) {
						error = 'Not a number';
						return;
					}

					error = '';
					value = parsed;
				}}
			/>
		{:else if type === 'address' && isAddress(value)}
			<div class="space-y-1">
				<input
					class="input"
					type="text"
					bind:value={addressSearchValue}
					placeholder="Search for an address"
				/>
				<input class="input" type="text" bind:value={value.street1} placeholder="Street 1" />
				<input class="input" type="text" bind:value={value.street2} placeholder="Street 2" />
				<input class="input" type="text" bind:value={value.city} placeholder="City" />
				<div class="flex space-x-1">
					<input class="input" type="text" bind:value={value.state} placeholder="State/Region" />
					<input
						class="input"
						type="text"
						bind:value={value.postalCode}
						placeholder="Postal Code"
					/>
				</div>
				<input class="input" type="text" bind:value={value.country} placeholder="Country" />
			</div>
		{:else if type === 'audio'}
			<input class="input" type="file" accept="audio/*" />
		{:else if type === 'file'}
			<input class="input" type="file" />
		{:else if type === 'image'}
			<input class="input" type="file" accept="image/*" />
		{:else if type === 'video'}
			<input class="input" type="file" accept="video/*" />
		{:else if type === 'checkbox' && isBoolean(value)}
			<input class="checkbox" type="checkbox" bind:checked={value} />
		{:else if type === 'choice' && hasChoiceOptions(options)}
			<select class="select" bind:value>
				{#each Object.entries(options.options) as [optionLabel, optionValue]}
					<option value={optionValue}>{optionLabel}</option>
				{/each}
			</select>
		{:else if type === 'date'}
			<input class="input" type="date" />
		{:else if type === 'link'}
			<input class="input" type="url" />
		{:else if type === 'multi-entry' && hasChoiceOptions(options)}
			<p class="text-error-500-400-token">Not implemented</p>
		{:else if type === 'multiple_choice' && hasChoiceOptions(options)}
			<select class="select" multiple>
				{#each Object.entries(options.options) as [optionLabel, optionValue]}
					<option value={optionValue}>{optionLabel}</option>
				{/each}
			</select>
		{:else if type === 'signature'}
			<input class="input" type="file" accept="image/*" />
		{:else if type === 'time'}
			<input class="input" type="time" />
		{:else}
			<p class="text-error-500-400-token">Field type not implemented: {type}</p>
		{/if}
	</div>
</div>
