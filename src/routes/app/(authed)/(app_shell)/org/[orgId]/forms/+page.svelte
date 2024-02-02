<script lang="ts">
	import { displayFieldTypes, inputFieldTypes } from '$lib/FormCreator/types/fieldTypes';
	import type { ExistingForm } from '$lib/FormCreator/types/formTypes';
	import { isInputFieldType } from '$lib/FormCreator/util/isFieldType';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { orgIdStore } from '$lib/stores/org';
	import {
		createDisplayFieldStructure,
		createInputFieldStructure
	} from '$lib/util/form/createFields';
	import { createFormStructure, saveFormDoc } from '$lib/util/form/createForm';
	import { deleteFormDoc } from '$lib/util/form/deleteForm';
	import { loadOrgForms } from '$lib/util/form/loadForms';
	import { toastError, toastSuccess } from '$lib/util/toast/toastNotifications';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let forms: ExistingForm[] = [];
	let isLoading = true;

	$: {
		if ($orgIdStore) {
			isLoading = true;
			reloadForms();
		}
	}

	const reloadForms = async () => {
		isLoading = true;

		try {
			forms = await loadOrgForms();
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to load forms');
		}

		isLoading = false;
	};

	const deleteForm = async (formId: string) => {
		const confirmed = confirm('Are you sure you want to delete this form?');

		isLoading = true;

		if (confirmed) {
			try {
				isLoading = true;
				await deleteFormDoc(formId);
				reloadForms();
			} catch (e) {
				console.error(e);
				toastError(toastStore, 'Failed to delete form');
				return;
			}
		}
	};
</script>

<a
	class="variant-filled-primary btn"
	href="/app/org/{$orgIdStore}/forms/editor"
	data-sveltekit-preload-data="hover">Create New Form</a
>

{#if import.meta.env.DEV}
	<button
		class="variant-outline-primary btn"
		on:click={() => {
			new Promise(async (resolve) => {
				const form = createFormStructure();

				const fields = [...inputFieldTypes, ...displayFieldTypes].map((type) => {
					if (isInputFieldType(type)) {
						return createInputFieldStructure(type);
					} else {
						return createDisplayFieldStructure(type);
					}
				});

				form.fields = fields;

				try {
					isLoading = true;
					await saveFormDoc(form);
					toastSuccess(toastStore, 'Created form');
					await reloadForms();
				} catch (e) {
					console.error(e);
					toastError(toastStore, 'Failed to create form');
				}

				return resolve(true);
			});
		}}>Create filled form</button
	>
{/if}

<hr />

{#if isLoading}
	<div class="flex items-center justify-center p-4">
		<LoadingSpinner />
	</div>
{:else}
	<div class="space-y-2">
		{#each forms as form}
			<div class="bg-surface-100-800-token overflow-hidden shadow rounded-token">
				<div class="bg-surface-200-700-token flex items-center justify-between p-4">
					<a class="h3 font-bold" href={`forms/editor/${form.id}`}>
						{form.name}
					</a>

					<div class="space-x-1">
						<button on:click={() => deleteForm(form.id)} class="variant-glass-error btn btn-sm"
							>Delete</button
						>
						<a href={`forms/editor/${form.id}`} class="variant-glass-secondary btn btn-sm">Edit</a>
						<a href={`forms/${form.id}/entries`} class="variant-filled-secondary btn btn-sm"
							>View Entries</a
						>
						<a href={`forms/${form.id}/entries/create`} class="variant-filled-primary btn btn-sm"
							>Add Entry</a
						>
					</div>
				</div>

				<div class="p-4">
					<a class="text-sm italic" href="">
						{form.entryCount} entries
					</a>
					<p class="text-sm italic">
						Updated on {form.updatedAt.toDate().toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})} at {form.updatedAt.toDate().toLocaleTimeString('en-US', {
							hour12: true,
							hour: 'numeric',
							minute: 'numeric'
						})}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
