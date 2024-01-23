<script>
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { auth } from '$lib/firebase';
	import { toastError } from '$lib/util/toast/toastNotifications';
	import { onSignIn } from '$lib/util/user/onSignIn';
	import { onSignOut } from '$lib/util/user/onSignOut';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { Toast, getToastStore, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	const toastStore = getToastStore();

	let isLoading = true;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			isLoading = false;

			if (!user) {
				// User is signed out
				onSignOut();
			} else {
				// User is signed in
				try {
					await onSignIn();
				} catch (e) {
					console.error(e);
					toastError(toastStore, 'Failed to load user data');
				}
			}
		});
	});
</script>

<Toast />

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<LoadingSpinner />
	</div>
{:else}
	<slot />
{/if}
