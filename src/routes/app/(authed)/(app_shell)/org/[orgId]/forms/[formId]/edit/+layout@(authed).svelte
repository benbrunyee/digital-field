<script lang="ts">
	import { page } from '$app/stores';
	import { getFormStore } from '$lib/FormCreator/stores/form';
	import FormEditorLayout from '$lib/Layouts/FormEditorLayout.svelte';
	import { loadForm } from '$lib/util/form/loadForms';
	import { toastError } from '$lib/util/toast/toastError';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();
	const formStore = getFormStore();

	onMount(() => {
		const formId = $page.params.formId;

		if (formId) {
			loadForm(formId)
				.then((form) => {
					formStore.set(form);
				})
				.catch((e) => {
					console.error(e);
					toastError(toastStore, 'Failed to load form');
				});
		} else {
			toastError(toastStore, 'No form ID provided');
		}
	});
</script>

<FormEditorLayout>
	<slot />
</FormEditorLayout>
