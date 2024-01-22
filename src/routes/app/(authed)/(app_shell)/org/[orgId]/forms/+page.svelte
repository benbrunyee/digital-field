<script lang="ts">
	import type { ExistingForm } from '$lib/FormCreator/types/formTypes';
	import { orgIdStore } from '$lib/stores/org';
	import { loadOrgForms } from '$lib/util/form/loadForms';
	import { toastError } from '$lib/util/toast/toastError';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	let forms: ExistingForm[] = [];

	$: {
		if ($orgIdStore) {
			loadOrgForms()
				.then((orgForms) => {
					forms = orgForms;
				})
				.catch((e) => {
					console.error(e);
					toastError(toastStore, 'Failed to load forms');
				});
		}
	}
</script>

<a class="variant-filled-primary btn" href="/app/org/{$orgIdStore}/forms/create">Create New Form</a>

<hr />

<div class="card space-y-2">
	{#each forms as form}
		<div class="flex items-center justify-between rounded-md bg-white p-4">
			<div>
				<h3 class="h3 font-bold">
					{form.name}
				</h3>
				<span class="text-sm italic">{form.updatedAt.toDateString()}</span>
			</div>

			<a href={`forms/${form.id}/edit`} class="variant-outline-primary btn">Edit</a>
		</div>
	{/each}
</div>
