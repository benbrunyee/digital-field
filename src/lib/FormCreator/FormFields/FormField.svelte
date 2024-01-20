<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import {
		type ExistingDisplayField,
		type ExistingInputField,
		type NewDisplayField,
		type NewInputField
	} from '../types/fieldTypes';
	import {
		isExistingDisplayField,
		isExistingInputField,
		isNewDisplayField,
		isNewInputField
	} from '../util/isFieldType';
	import DisplayField from './DisplayField.svelte';
	import InputField from './InputField.svelte';

	export let field: ExistingDisplayField | NewDisplayField | ExistingInputField | NewInputField;

	// Update the context using a store
	let hasChanged = writable(false);
	setContext('hasChanged', hasChanged);
	setContext('isNewField', !('createdAt' in field));

	function fieldHasChanged() {
		$hasChanged = true;
	}
</script>

<div class="bg-surface-50-900-token rounded-token">
	{#if isExistingInputField(field) || isNewInputField(field)}
		<InputField bind:field on:fieldChanged={fieldHasChanged} />
	{:else if isExistingDisplayField(field) || isNewDisplayField(field)}
		<DisplayField bind:field on:fieldChanged={fieldHasChanged} />
	{:else}
		<span>There was a problem with displaying this element.</span>
	{/if}
</div>
