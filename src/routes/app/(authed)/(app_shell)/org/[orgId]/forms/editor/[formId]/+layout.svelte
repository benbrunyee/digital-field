<script lang="ts">
	import { page } from '$app/stores';
	import { getFormStore } from '$lib/FormCreator/stores/form';
	import { loadForm } from '$lib/util/form/loadForms';
	import { toastError } from '$lib/util/toast/toastNotifications';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { isLoading } from '../+layout@(authed).svelte';

	const toastStore = getToastStore();
	const formStore = getFormStore();

	onMount(() => {
		const formId = $page.params.formId;

		if (formId) {
			$isLoading = true;
			loadForm(formId)
				.then((form) => {
					formStore.set(form);
				})
				.catch((e) => {
					console.error(e);
					toastError(toastStore, 'Failed to load form');
				})
				.finally(() => {
					$isLoading = false;
				});
		} else {
			toastError(toastStore, 'No form ID provided');
			$isLoading = false;
		}
	});
</script>

<slot />
