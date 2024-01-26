<script lang="ts">
	import type { ExistingForm } from '$lib/FormCreator/types/formTypes';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { orgIdStore } from '$lib/stores/org';
	import { deleteFormDoc } from '$lib/util/form/deleteForm';
	import { loadOrgForms } from '$lib/util/form/loadForms';
	import { toastError, toastSuccess } from '$lib/util/toast/toastNotifications';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		displayFieldTypes,
		inputFieldTypes
	} from '../../../../../../../lib/FormCreator/types/fieldTypes';
	import { isInputFieldType } from '../../../../../../../lib/FormCreator/util/isFieldType';
	import {
		createDisplayFieldStructure,
		createInputFieldStructure
	} from '../../../../../../../lib/util/form/createFields';
	import { createFormStructure, saveFormDoc } from '../../../../../../../lib/util/form/createForm';

	const toastStore = getToastStore();

	let forms: ExistingForm[] = [];
	let isLoading = true;

	$: {
		if ($orgIdStore) {
			isLoading = true;
			reloadForms().finally(() => {
				isLoading = false;
			});
		}
	}

	const reloadForms = async () => {
		try {
			forms = await loadOrgForms();
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to load forms');
		}
	};

	const deleteForm = async (formId: string) => {
		const confirmed = confirm('Are you sure you want to delete this form?');

		if (confirmed) {
			try {
				isLoading = true;
				await deleteFormDoc(formId);
				reloadForms().finally(() => {
					isLoading = false;
				});
			} catch (e) {
				console.error(e);
				toastError(toastStore, 'Failed to delete form');
				return;
			}
		}
	};
</script>

<a class="variant-filled-primary btn" href="/app/org/{$orgIdStore}/forms/editor">Create New Form</a>

{#if import.meta.env.DEV}
	<button
		class="variant-outline-primary btn"
		on:click={async () => {
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
				await saveFormDoc(form);
				toastSuccess(toastStore, 'Created form');
				await reloadForms();
			} catch (e) {
				console.error(e);
				toastError(toastStore, 'Failed to create form');
			}
		}}>Create filled form</button
	>
{/if}

<hr />

{#if isLoading}
	<div class="flex items-center justify-center p-4">
		<LoadingSpinner />
	</div>
{:else}
	<div class="card space-y-2">
		{#each forms as form}
			<div class="bg-surface-50-900-token flex items-center justify-between rounded-md p-4">
				<div>
					<h3 class="h3 font-bold">
						{form.name}
					</h3>
					<span class="text-sm italic">{form.updatedAt.toDateString()}</span>
				</div>

				<div class="space-x-1">
					<button on:click={() => deleteForm(form.id)} class="variant-outline-error btn btn-sm"
						>Delete</button
					>
					<a href={`forms/editor/${form.id}`} class="variant-filled-secondary btn btn-sm">Edit</a>
					<a href={`forms/${form.id}/entries/create`} class="variant-filled-secondary btn btn-sm"
						>Add Entry</a
					>
				</div>
			</div>
		{/each}
	</div>
{/if}
