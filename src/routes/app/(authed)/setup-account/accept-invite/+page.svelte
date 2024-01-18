<script lang="ts" context="module">
	export type AcceptOrgInviteData = {
		orgId: string;
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Org } from '$lib/OrgCreator/types/orgType';
	import { functions } from '$lib/firebase';
	import { toastError } from '$lib/util/toast/toastError';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { httpsCallable } from 'firebase/functions';

	const toastStore = getToastStore();

	let orgs: Org[] = [
		{
			createdAt: new Date(),
			id: '1',
			members: [],
			name: 'Org 1',
			ownerId: '1',
			plan: 'standard',
			updatedAt: new Date()
		}
	];

	const rejectInvite = async (orgId: string) => {
		try {
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to reject invite');
		}

		orgs = orgs.filter((org) => org.id !== orgId);
	};

	const acceptInvite = async (orgId: string) => {
		try {
			await httpsCallable<AcceptOrgInviteData>(functions, 'acceptOrgInvite')({ orgId });
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to accept invite');
		}

		orgs = orgs.filter((org) => org.id !== orgId);
	};

	const continueSetup = () => {
		goto('/app/setup-account/create-organisation');
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="card bg-surface-50-900-token space-y-2 p-4 text-center">
		{#if orgs.length}
			<h3 class="h3 text-center">You have been invited to the following organizations:</h3>

			<div class="card bg-surface-100-800-token space-y-1 p-4">
				{#each orgs as org (org.id)}
					<div class="bg-surface-50-900-token flex items-center justify-between rounded-full p-2">
						<div class="flex items-center space-x-2">
							<img
								src={'https://api.dicebear.com/7.x/pixel-art/svg'}
								alt="Organization Logo"
								class="h-10"
							/>
							<div class="space-x-1">
								<span class="font-bold">{org.name}</span>
								<span class="text-surface-400-500-token text-xs">{org.members.length} members</span>
							</div>
						</div>
						<div>
							<button class="variant-filled-primary btn" on:click={() => acceptInvite(org.id)}
								>Accept</button
							>
							<button class="variant-outline-primary btn" on:click={() => rejectInvite(org.id)}
								>Decline</button
							>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<h3 class="h3 text-center">You have no pending invites</h3>
		{/if}

		<button
			disabled={Boolean(orgs.length)}
			class="variant-outline-primary btn"
			on:click={continueSetup}>Continue</button
		>
		{#if orgs.length}
			<p class="text-surface-400-500-token text-xs">You must accept all invites to continue</p>
		{/if}
	</div>
</div>
