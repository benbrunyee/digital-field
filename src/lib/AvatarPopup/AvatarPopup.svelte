<script lang="ts">
	import { userStore } from '$lib/util/user/stores/userStore';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { auth } from '../firebase';
	import { toastError } from '../util/toast/toastNotifications';
	import { onSignOut } from '../util/user/onSignOut';

	const toastStore = getToastStore();

	$: avatarInitials = $userStore?.name.charAt(0) || $userStore?.email.charAt(0) || '..';
</script>

<div data-popup="avatarPopup" class="card bg-surface-100-800-token p-4">
	<div class="flex flex-col items-center space-y-2">
		<Avatar
			initials={avatarInitials}
			border="border-2 border-primary-500"
			class="w-10 lg:w-14"
			background="bg-primary-400-500-token"
		/>
		<p class="font-bold">{$userStore?.name || $userStore.email}</p>
		<button
			class="variant-filled btn self-stretch"
			on:click={() => {
				auth
					.signOut()
					.then(() => {
						onSignOut();
					})
					.catch((err) => {
						console.error(err);
						toastError(toastStore, 'Failed to sign out');
					});
			}}>Sign Out</button
		>
	</div>
</div>
