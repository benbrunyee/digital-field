<script lang="ts">
	import { page } from '$app/stores';
	import type { Org } from '$lib/OrgCreator/types/orgType';
	import { orgIdStore } from '$lib/stores/org';
	import { getOrg } from '$lib/util/org/loadOrg';
	import { toastError } from '$lib/util/toast/toastNotifications';
	import { onSignOut } from '$lib/util/user/onSignOut';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Get the loaded org from the url
	// Save it to the browser's local storage
	// so that we load it by default next time

	const toastStore = getToastStore();

	onMount(async () => {
		const orgId = $page.params.orgId;

		if (orgId) {
			let org: Org | undefined;

			// Try to load the org first
			try {
				org = await getOrg(orgId);
			} catch (e) {
				console.error(e);
				toastError(toastStore, 'Failed to load organisation details');
				onSignOut();
			}

			$orgIdStore = orgId;
		}
	});
</script>

<slot />
