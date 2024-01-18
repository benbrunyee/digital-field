<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Navigation, { navigation } from '$lib/Navigation/Navigation.svelte';
	import { pageTitle } from '$lib/Navigation/stores/pageTitle';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		LightSwitch,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { userStore } from '../../../../lib/util/user/stores/userStore';

	onMount(() => {
		const lastLoadedOrgId = localStorage.getItem('lastLoadedOrgId');

		if (lastLoadedOrgId) {
			// Navigate to the last loaded org
			goto(`/app/org/${lastLoadedOrgId}`);
		}
	});

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;

		navigation.forEach((navItem) => {
			if (
				navItem.path === $page.url.pathname ||
				$page.url.pathname.startsWith(navItem.path + '/')
			) {
				$pageTitle = navItem.name;
			}
		});
	});

	const drawerStore = getDrawerStore();
	let previousPage = '/';

	function drawerOpen() {
		drawerStore.open({});
	}

	function goBack() {
		goto(previousPage);
	}
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation />
</Drawer>

<AppShell slotSidebarLeft="w-0 lg:w-64 lg:border-r lg:border-neutral-400">
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
				<Avatar
					initials={$userStore?.email.charAt(0) ?? '..'}
					border="border-1 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
					class="w-10 lg:w-14"
					background="bg-primary-400-500-token"
				/>
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
