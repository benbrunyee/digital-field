<script lang="ts">
	import { isExistingDisplayField, isExistingInputField } from '$lib/FormCreator/util/isFieldType';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.svelte';
	import { formatFieldType } from '../SelectableElements/util/formatFieldType';
	import { saveEntryDoc } from '../util/entry/createEntry';
	import { toastError, toastSuccess } from '../util/toast/toastNotifications';
	import EntryDisplayField from './EntryInputFields/EntryDisplayField.svelte';
	import EntryInputField from './EntryInputFields/EntryInputField.svelte';
	import { initializeEntryStore } from './stores/entry';

	export let formId: string;
	export let entryId: string | undefined = undefined;

	const toastStore = getToastStore();
	const entry = initializeEntryStore(formId);

	let isLoading = true;

	$: formId && entryId && loadEntry();
	$: $entry && (isLoading = false);

	$: console.log($entry);

	const loadEntry = async () => {
		console.log('Loading entry');

		if (!(formId && entryId)) {
			isLoading = false;
			console.log('Entry not loaded');

			return;
		}

		try {
			await entry.setEntryId(entryId);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to load entry');
		}

		console.log('Entry loaded');
		isLoading = false;
	};

	const saveEntry = async () => {
		if (!$entry?.entry || !$entry.form) {
			toastError(toastStore, 'Failed to save entry');
			return;
		}

		try {
			await saveEntryDoc($entry.form.id, $entry.entry);
			toastSuccess(toastStore, 'Entry saved');
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to save entry');
		}
	};
</script>

<div class="mx-auto my-2 max-w-screen-lg p-2">
	{#if isLoading}
		<div class="flex items-center justify-center p-4">
			<LoadingSpinner />
		</div>
	{:else if !$entry?.form}
		<div class="card bg-surface-50-900-token p-4">
			<span class="bg-surface-50-900-token text-error-500-400-token">Could not find form</span>
		</div>
	{:else}
		<div class="space-y-2">
			{#each $entry.form.fields as field ('id' in field ? field.id : field.clientId)}
				{@const id = 'id' in field ? field.id : field.clientId}

				{#if isExistingDisplayField(field)}
					<EntryDisplayField text={field.value ?? field.type} type={field.type} />
				{:else if isExistingInputField(field) && $entry.entry?.fields[field.id]}
					<EntryInputField
						name={field.name}
						hint={formatFieldType(field.type)}
						type={field.type}
						bind:value={$entry.entry.fields[field.id].value}
						options={{}}
					/>
				{/if}
			{/each}

			<div class="text-center">
				<button class="variant-filled-primary btn" on:click={() => saveEntry()}>
					Create Entry
				</button>
			</div>
		</div>
	{/if}
</div>
