<script lang="ts" context="module">
</script>

<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import Icon from '@iconify/svelte';
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
	export let description = '';

	let addressSearchValue = '';
	let error = '';

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	const isString = (value: unknown): value is string => typeof value === 'string';
	const isArray = (value: unknown): value is EntryValueType[] => Array.isArray(value);
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
		<div class="leading-4">
			<p class="font-bold">{name}</p>
			<span class="text-surface-400-500-token text-xs italic">{hint}</span>
		</div>

		<p class="mr-4 text-sm">{description}</p>
	</div>

	<div class="basis-1/2">
		{#if type === 'text' && isString(value)}
			<input type="text" bind:value class="input variant-ringed-surface w-full" />
		{:else if type === 'number'}
			<input class="input variant-ringed-surface w-full" type="number" bind:value />
		{:else if type === 'address' && isAddress(value)}
			<div class="space-y-1">
				<input
					class="input variant-ringed-surface"
					type="text"
					bind:value={addressSearchValue}
					placeholder="Search for an address"
				/>
				<input
					class="input variant-ringed-surface"
					type="text"
					bind:value={value.street1}
					placeholder="Street 1"
				/>
				<input
					class="input variant-ringed-surface"
					type="text"
					bind:value={value.street2}
					placeholder="Street 2"
				/>
				<input
					class="input variant-ringed-surface"
					type="text"
					bind:value={value.city}
					placeholder="City"
				/>
				<div class="flex space-x-1">
					<input
						class="input variant-ringed-surface"
						type="text"
						bind:value={value.state}
						placeholder="State/Region"
					/>
					<input
						class="input variant-ringed-surface"
						type="text"
						bind:value={value.postalCode}
						placeholder="Postal Code"
					/>
				</div>
				<input
					class="input variant-ringed-surface"
					type="text"
					bind:value={value.country}
					placeholder="Country"
				/>
			</div>
		{:else if type === 'audio'}
			<input class="input variant-ringed-surface" type="file" accept="audio/*" />
		{:else if type === 'file'}
			<input class="input variant-ringed-surface" type="file" />
		{:else if type === 'image'}
			<input class="input variant-ringed-surface" type="file" accept="image/*" />
		{:else if type === 'video'}
			<input class="input variant-ringed-surface" type="file" accept="video/*" />
		{:else if type === 'checkbox' && isBoolean(value)}
			<input class="checkbox variant-ringed-surface" type="checkbox" bind:checked={value} />
		{:else if type === 'choice' && hasChoiceOptions(options)}
			<div class="relative">
				<button class="variant-ringed-surface btn w-full justify-between" use:popup={popupCombobox}>
					<span
						>{typeof value === 'string'
							? options.choiceOptions[value]?.label || 'Choose an option'
							: 'An error occurred'}</span
					>
					<span>
						<Icon icon="material-symbols:arrow-drop-down" />
					</span>
				</button>
				<div class="card w-full p-2 shadow-xl" data-popup="popupCombobox">
					<ListBox>
						<ListBoxItem bind:group={value} name="medium" value="">Choose an option</ListBoxItem>
						{#each Object.values(options.choiceOptions) as choiceOption}
							<ListBoxItem bind:group={value} name="medium" value={choiceOption.value}>
								{choiceOption.label}
							</ListBoxItem>
						{/each}
					</ListBox>
				</div>
			</div>
		{:else if type === 'date'}
			<input class="input variant-ringed-surface" type="date" />
		{:else if type === 'link'}
			<input class="input variant-ringed-surface" type="url" />
		{:else if type === 'multi-entry' && hasChoiceOptions(options)}
			<p class="text-error-500-400-token">Not implemented</p>
		{:else if type === 'multiple_choice' && hasChoiceOptions(options) && isArray(value)}
			<select class="select variant-ringed-surface" multiple bind:value>
				{#each Object.values(options.choiceOptions) as choiceOption}
					<option class="!bg-transparent" value={choiceOption.value}>{choiceOption.label}</option>
				{/each}
			</select>
			<button
				class="variant-glass-surface btn mt-1 w-full"
				on:click={() => {
					value = [];
				}}>Clear selection</button
			>
		{:else if type === 'signature'}
			<input class="input variant-ringed-surface" type="file" accept="image/*" />
		{:else if type === 'time'}
			<input class="input variant-ringed-surface" type="time" />
		{:else}
			<p class="text-error-500-400-token">Field type not implemented: {type}</p>
		{/if}
	</div>
</div>
