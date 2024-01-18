<script lang="ts">
	import { initializeFormStore } from '$lib/EntryCreator/stores/form';
	import FormElementSelection from '$lib/FormCreator/FormSelectables/FormElementSelection.svelte';
	import FormSettings from '$lib/FormCreator/FormSettings.svelte';
	import { createFormStructure } from '$lib/FormCreator/util/createForm';
	import OutputElementSelection from '$lib/OutputCreator/OutputSelectables/OutputElementSelection.svelte';
	import { AppBar, AppShell, Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import { tab } from './+page.svelte';

	initializeFormStore(createFormStructure());
</script>

<AppShell
	slotSidebarLeft="w-0 lg:w-64 p-4 lg:border-r lg:border-surface-300-600-token"
	slotSidebarRight="w-0 lg:w-96 p-4 lg:border-l lg:border-surface-300-600-token"
>
	<svelte:fragment slot="header">
		<AppBar slotTrail="place-content-end" shadow="shadow-xl">
			<svelte:fragment slot="lead">
				<h2 class="h2 ml-4">Form Creator</h2>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<Avatar
					initials=".."
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
					class="w-10 lg:w-14"
				/>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if $tab === 'input'}
			<FormElementSelection />
		{:else if $tab === 'output'}
			<OutputElementSelection />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		{#if $tab === 'input'}
			<FormSettings />
		{/if}
	</svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<div class="flex h-full p-4">
		<slot />
	</div>
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<!-- (footer) -->
</AppShell>
