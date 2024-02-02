<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AvatarPopup from '$lib/AvatarPopup/AvatarPopup.svelte';
	import Navigation from '$lib/Navigation/Navigation.svelte';
	import { pageTitle } from '$lib/Navigation/stores/pageTitle';
	import { userStore } from '$lib/util/user/stores/userStore';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		getDrawerStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { previousPageStore } from '../../../+layout.svelte';

	const avatarPopup: PopupSettings = {
		event: 'click',
		target: 'avatarPopup',
		placement: 'bottom-end'
	};

	$: avatarInitials = $userStore?.name.charAt(0) || $userStore?.email.charAt(0) || '..';

	const drawerStore = getDrawerStore();

	function drawerOpen() {
		drawerStore.open({});
	}

	async function goBack() {
		await goto($previousPageStore);
	}
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<AppShell
	slotSidebarLeft="w-0 lg:w-64 lg:border-r lg:border-surface-300-600-token bg-surface-50-900-token"
	regionPage="bg-surface-50-900-token"
>
	<svelte:fragment slot="header">
		<AppBar slotTrail="place-content-end" shadow="shadow-xl">
			<svelte:fragment slot="lead">
				<button class="lg:hidden" on:click={() => drawerOpen()}>
					<Icon icon="material-symbols:menu-rounded" class="text-3xl" />
				</button>
				{#if $page.url.pathname.split('').filter((char) => char === '/').length > 1}
					<button on:click={() => goBack()}>
						<Icon icon="material-symbols:arrow-back-rounded" class="text-3xl" />
					</button>
				{/if}
				<h2 class="h2 ml-4">{$pageTitle}</h2>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<div use:popup={avatarPopup}>
					<Avatar
						initials={avatarInitials}
						border="border-2 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer"
						class="w-10 lg:w-14"
						background="bg-primary-400-500-token"
					/>
				</div>
				<AvatarPopup />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<div class="space-y-2 p-4">
		<slot />
	</div>
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<!-- (footer) -->
</AppShell>
