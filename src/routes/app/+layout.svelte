<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { toastError } from '$lib/util/toast/toastError';
	import { getUserDoc } from '$lib/util/user/getUserDoc';
	import { userStore } from '$lib/util/user/stores/userStore';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Toast, getToastStore, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	const toastStore = getToastStore();

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (!user) {
				// User is signed out
				goto('/app/sign-in');
			} else {
				// User is signed in
				try {
					const userData = await getUserDoc();
					userStore.set(userData);
					goto(`/app/org/${$userStore?.primaryOrgId}`);
				} catch (e) {
					console.error(e);
					toastError(toastStore, 'Failed to load user data');
				}
			}
		});
	});
</script>

<Toast />
<slot />
