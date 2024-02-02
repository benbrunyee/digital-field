<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { saveFormDoc } from '../util/form/createForm';
	import { toastError, toastSuccess } from '../util/toast/toastNotifications';
	import { getFormStore } from './stores/form';

	let isSubmitting = false;

	const formStore = getFormStore();
	const toastStore = getToastStore();

	const saveForm = async () => {
		isSubmitting = true;

		try {
			const savedForm = await saveFormDoc($formStore);

			if (!savedForm) {
				throw new Error('Failed to save form');
			}

			toastSuccess(toastStore, 'Form saved');
			await goto(`editor/${savedForm.id}`);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to save form');
		}

		isSubmitting = false;
	};
</script>

<div class="flex h-full flex-col space-y-2">
	<h3 class="h3 ml-2">Settings</h3>
	<hr />

	<div class="flex-1 overflow-auto">
		<input class="input variant-outline h4" bind:value={$formStore.name} />
	</div>

	<div>
		<button class="variant-filled-primary btn w-full" on:click={saveForm}>Save</button>
	</div>
</div>
