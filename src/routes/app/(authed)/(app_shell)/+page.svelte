<script lang="ts">
	import { goto } from '$app/navigation';
	import { orgIdStore } from '$lib/stores/org';
	import { onSignOut } from '$lib/util/user/onSignOut';
	import { userStore } from '$lib/util/user/stores/userStore';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($orgIdStore) {
			// Navigate to the last loaded org
			console.debug('Navigating to org', $orgIdStore);
			await goto(`/app/org/${$orgIdStore}`);
		} else {
			// Navigate to the first org the user owns
			const primaryOrg = $userStore.primaryOrgId;

			if (primaryOrg) {
				console.debug('Navigating to primary org', primaryOrg);
				await goto(`/app/org/${$userStore.primaryOrgId}`);
			} else {
				await onSignOut();
			}
		}
	});
</script>
