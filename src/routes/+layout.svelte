<script>
	import '../app.pcss';

	import { auth } from '$lib/firebase';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Toast, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				// User is signed out
				// goto('/sign-in');
			} else {
				// User is signed in
			}
		});
	});
</script>

<Toast />
<slot />
