<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const tabs = ['input', 'output'] as const;
	export const tab = writable<(typeof tabs)[number]>('input');

	export const isLoading = writable<boolean>(false);
</script>

<script lang="ts">
	import FormBuilder from '$lib/FormCreator/FormBuilder.svelte';
	import FormElementSelection from '$lib/FormCreator/FormSelectables/FormElementSelection.svelte';
	import FormSettings from '$lib/FormCreator/FormSettings.svelte';
	import { initializeFormStore } from '$lib/FormCreator/stores/form';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import OutputEntityEditor from '$lib/OutputCreator/OutputEntityEditor.svelte';
	import OutputElementSelection from '$lib/OutputCreator/OutputSelectables/OutputElementSelection.svelte';
	import {
		AppBar,
		AppShell,
		Avatar,
		LightSwitch,
		RadioGroup,
		RadioItem
	} from '@skeletonlabs/skeleton';

	// export let data: PageData;

	initializeFormStore();
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
		<div class="flex flex-auto flex-col items-center space-y-4">
			<RadioGroup>
				<RadioItem bind:group={$tab} name="justify" value="input">Input</RadioItem>
				<RadioItem bind:group={$tab} name="justify" value="output">Output</RadioItem>
			</RadioGroup>

			{#if $isLoading}
				<LoadingSpinner />
			{:else if $tab === 'input'}
				<FormBuilder />
			{:else if $tab === 'output'}
				<OutputEntityEditor />
			{/if}
		</div>
	</div>
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<!-- (footer) -->
</AppShell>

<slot />
