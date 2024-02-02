<script lang="ts">
	import type { ExistingForm } from '$lib/FormCreator/types/formTypes';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { orgIdStore } from '$lib/stores/org';
	import { deleteFormDoc } from '$lib/util/form/deleteForm';
	import { loadOrgForms } from '$lib/util/form/loadForms';
	import { toastError } from '$lib/util/toast/toastNotifications';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';

	const toastStore = getToastStore();

	let forms: ExistingForm[] = [];
	let isLoading = true;
	let searchValue = '';
	let sortBy:
		| 'created-asc'
		| 'created-desc'
		| 'updated-asc'
		| 'updated-desc'
		| 'name-asc'
		| 'name-desc'
		| 'entry-count-asc'
		| 'entry-count-desc' = 'updated-desc';

	$: {
		if ($orgIdStore) {
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
				await reloadForms({ noLoading: true });
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

<div class="card flex items-center justify-between bg-neutral-100 p-4">
	<div class="flex space-x-2">
		<div class="input-group input-group-divider variant-ringed grid-cols-[auto_1fr]">
			<div class="input-group-shim">
				<Icon icon="material-symbols:search" class="h-5 w-5" />
			</div>
			<input bind:value={searchValue} placeholder="Search forms" class="" />
		</div>

		<div class="input-group input-group-divider variant-ringed grid-cols-[auto_1fr]">
			<div class="input-group-shim">
				<Icon icon="material-symbols:sort-rounded" class="h-5 w-5" />
			</div>
			<select bind:value={sortBy}>
				<option value="updated-desc">Updated Date (Descending)</option>
				<option value="updated-asc">Updated Date (Ascending)</option>
				<option value="created-desc">Created Date (Descending)</option>
				<option value="created-asc">Created Date (Ascending)</option>
				<option value="name-desc">Name (Descending)</option>
				<option value="name-asc">Name (Ascending)</option>
				<option value="entry-count-desc">Entry Count (Descending)</option>
				<option value="entry-count-asc">Entry Count (Ascending)</option>
			</select>
		</div>
	</div>

	<a
		class="variant-filled-primary btn"
		href="/app/org/{$orgIdStore}/forms/editor"
		data-sveltekit-preload-data="hover">Create New Form</a
	>
</div>

<hr class="mx-4" />

{#if isLoading}
	<div class="flex items-center justify-center p-4">
		<LoadingSpinner />
	</div>
{:else}
	<div class="space-y-2">
		{#each forms as form (form.id)}
			<div class="card overflow-hidden bg-white shadow rounded-token" transition:slide>
				<div class="card bg-neutral-100 dark:bg-surface-700">
					<a href={`forms/editor/${form.id}`} class="flex items-center justify-between p-4">
						<h3 class="h3 font-bold">
							{form.name}
						</h3>

						<div class="space-x-1">
							<button
								on:click={(e) => {
									e.preventDefault();
									deleteForm(form.id);
								}}
								class="variant-glass-error btn btn-sm">Delete</button
							>
							<a href={`forms/editor/${form.id}`} class="variant-glass-secondary btn btn-sm">Edit</a
							>
							<a href={`forms/${form.id}/entries`} class="variant-filled-secondary btn btn-sm"
								>View Entries</a
							>
							<a href={`forms/${form.id}/entries/create`} class="variant-filled-primary btn btn-sm"
								>Add Entry</a
							>
						</div>
					</a>
				</div>

				<div class="flex items-center space-x-2 px-4 pb-4 pt-2">
					<a class="text-sm italic" href={`forms/${form.id}/entries`}>
						{form.entryCount} entries
					</a>
					<div class="divider-vertical h-4" />
					<span class="text-sm italic">
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
					</span>
				</div>
			</div>
		{/each}
	</div>
{/if}
