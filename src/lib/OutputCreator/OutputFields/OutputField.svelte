<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import type {
		ExistingOutputDisplayField,
		ExistingOutputInputField,
		NewOutputDisplayField,
		NewOutputInputField
	} from '../types/outputFieldTypes';
	import {
		isExistingOutputDisplayField,
		isExistingOutputInputField,
		isNewOutputDisplayField,
		isNewOutputInputField
	} from '../util/isOutputFieldType';
	import OutputDisplayField from './OutputDisplayField.svelte';
	import OutputInputField from './OutputInputField.svelte';

	export let field:
		| NewOutputInputField
		| ExistingOutputInputField
		| NewOutputDisplayField
		| ExistingOutputDisplayField;

	// Update the context using a store
	let hasChanged = writable(false);
	setContext('hasChanged', hasChanged);

	// TODO: Find a way of determining whether this is a new field or not
	// setContext('isNewField', field.createdAt === undefined);

	function fieldHasChanged() {
		$hasChanged = true;
	}
</script>

<div class="bg-surface-50-900-token rounded-token">
	{#if isExistingOutputInputField(field) || isNewOutputInputField(field)}
		<OutputInputField bind:field on:fieldChanged={fieldHasChanged} />
	{:else if isExistingOutputDisplayField(field) || isNewOutputDisplayField(field)}
		<OutputDisplayField bind:field on:fieldChanged={fieldHasChanged} />
	{:else}
		<span>There was a problem with displaying this element.</span>
	{/if}
</div>
