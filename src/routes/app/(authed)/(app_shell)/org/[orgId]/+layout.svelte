<script lang="ts">
	import { page } from '$app/stores';
	import { orgIdStore } from '$lib/stores/org';
	import { onMount } from 'svelte';

	// Get the loaded org from the url
	// Save it to the browser's local storage
	// so that we load it by default next time

	onMount(() => {
		const orgId = $page.params.orgId;

		if (orgId) {
			localStorage.setItem('lastLoadedOrgId', orgId);
			$orgIdStore = orgId;
			console.log('orgId', orgId);
		}
	});
</script>

<slot />
