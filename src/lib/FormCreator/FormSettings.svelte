<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { toastError } from '../util/toast/toastError';
	import { getFormStore } from './stores/form';
	import { saveFormDoc } from './util/createForm';

	let isSubmitting = false;

	const formStore = getFormStore();
	const toastStore = getToastStore();

	const saveForm = async () => {
		isSubmitting = true;

		try {
			await saveFormDoc($formStore);
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
