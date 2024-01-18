<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, firestore } from '$lib/firebase';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { addDoc, collection } from 'firebase/firestore';
	import { toastError } from '../util/toast/toastError';

	const toastStore = getToastStore();

	let name = 'My organisation';

	const createOrganisation = async () => {
		if (!auth.currentUser) {
			toastError(toastStore, 'You must be signed in to create an organisation');
			goto('/app/sign-in');
			return;
		}

		if (!name) {
			toastError(toastStore, 'Please enter a name for your organisation');
			return;
		}

		addDoc(collection(firestore, 'org'), {
			name,
			owner: auth.currentUser.uid
		});
	};
</script>

<div class="space-y-2">
	<h2 class="h2">Name your organisation</h2>

	<div>
		<input type="text" placeholder="Organisation name" class="input" bind:value={name} />
	</div>

	<div class="text-center">
		<button class="variant-filled-primary btn" on:click={createOrganisation}
			>Create organisation</button
		>
	</div>
</div>
