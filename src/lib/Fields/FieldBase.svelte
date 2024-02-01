<script lang="ts">
	import Icon from '@iconify/svelte';
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { getFormStore } from '../FormCreator/stores/form';

	export let name: string;
	export let id: string;

	const hasChanged = getContext<Writable<boolean>>('hasChanged');
	const isNewField = getContext<boolean>('isNewField');
	const formContext = getFormStore();

	/**
	 * Events:
	 * - fieldChanged: Set to true when the field has been modified
	 */
	const dispatch = createEventDispatcher();

	function onInputChanged() {
		dispatch('fieldChanged', true);
	}
</script>

<AccordionItem>
	<svelte:fragment slot="lead">
		<div class="flex space-x-2">
			<Icon icon="mdi:drag" class="h-4 w-4" />
			<slot name="icon" />
		</div>
	</svelte:fragment>

	<svelte:fragment slot="summary">
		<span>{name}</span>
		{#if isNewField}
			<span class="variant-filled-success badge ml-1">New</span>
		{:else if $hasChanged}
			<span class="text-warning-600-300-token ml-1 text-xs">Modified</span>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="content">
		<div class="flex flex-col space-y-2">
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">Name<span class="text-error-500-400-token">*</span></div>
				<input type="text" bind:value={name} on:input={onInputChanged} />
			</div>
			<slot />
			<button class="variant-ghost-error btn ml-auto" on:click={() => formContext.removeField(id)}
				>Delete</button
			>
		</div>
	</svelte:fragment>
</AccordionItem>
