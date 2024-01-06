<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { type FieldI } from '../types/fieldTypes';
	import { isDisplayField, isInputField } from '../util/isFieldType';
	import DisplayField from './DisplayField.svelte';
	import InputField from './InputField.svelte';

	export let field: FieldI;

	// Update the context using a store
	let hasChanged = writable(false);
	setContext('hasChanged', hasChanged);
	setContext('isNewField', field.createdAt === undefined);

	function fieldHasChanged() {
		$hasChanged = true;
	}
</script>

<div class="bg-surface-50-900-token rounded-token">
	{#if isInputField(field)}
		<InputField bind:field on:fieldChanged={fieldHasChanged} />
	{:else if isDisplayField(field)}
		<DisplayField bind:field on:fieldChanged={fieldHasChanged} />
	{:else}
		<span>There was a problem with displaying this element.</span>
	{/if}
</div>
