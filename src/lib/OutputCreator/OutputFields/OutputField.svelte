<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type { OutputFieldI } from '../types/outputFieldTypes';
	import { isOutputDisplayField, isOutputInputField } from '../util/isOutputFieldType';
	import OutputDisplayField from './OutputDisplayField.svelte';
	import OutputInputField from './OutputInputField.svelte';

	export let field: OutputFieldI;

	// Update the context using a store
	let hasChanged = writable(false);
	setContext('hasChanged', hasChanged);
	setContext('isNewField', field.createdAt === undefined);

	function fieldHasChanged() {
		$hasChanged = true;
	}
</script>

<div class="bg-surface-50-900-token rounded-token">
	{#if isOutputInputField(field)}
		<OutputInputField bind:field on:fieldChanged={fieldHasChanged} />
	{:else if isOutputDisplayField(field)}
		<OutputDisplayField bind:field on:fieldChanged={fieldHasChanged} />
	{:else}
		<span>There was a problem with displaying this element.</span>
	{/if}
</div>
