<script lang="ts">
	import type { ExistingForm } from '$lib/FormCreator/types/formTypes';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { orgIdStore } from '$lib/stores/org';
	import { deleteFormDoc } from '$lib/util/form/deleteForm';
	import { loadOrgForms } from '$lib/util/form/loadForms';
	import { toastError } from '$lib/util/toast/toastNotifications';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';

	const toastStore = getToastStore();

	let forms: ExistingForm[] = [];
	let isLoading = true;

	$: {
		if ($orgIdStore) {
			isLoading = true;
			reloadForms();
		}
	}

	const reloadForms = async ({ noLoading } = { noLoading: false }) => {
		if (!noLoading) isLoading = true;

		try {
			forms = await loadOrgForms();
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to load forms');
		}

		if (!noLoading) isLoading = false;
	};

	const deleteForm = async (formId: string) => {
		const confirmed = confirm('Are you sure you want to delete this form?');

		if (confirmed) {
			// Remove the form from the list
			// Create a backup of the forms array
			const oldForms = [...forms];

			// Remove the form from the array
			forms = forms.filter((form) => form.id !== formId);

			try {
				// Delete the form from the database
				await deleteFormDoc(formId);

				// Reload the forms without showing the loading spinner
				reloadForms({ noLoading: true });
			} catch (e) {
				console.error(e);
				toastError(toastStore, 'Failed to delete form');

				// Restore the forms array
				forms = oldForms;
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

<hr />

{#if isLoading}
	<div class="flex items-center justify-center p-4">
		<LoadingSpinner />
	</div>
{:else}
	<div class="space-y-2">
		{#each forms as form (form.id)}
			<div class="card overflow-hidden bg-white shadow rounded-token" transition:slide>
				<div class="card flex items-center justify-between bg-neutral-100 p-4 dark:bg-surface-700">
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
					<a class="text-sm italic" href={`forms/${form.id}/entries`}>
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
