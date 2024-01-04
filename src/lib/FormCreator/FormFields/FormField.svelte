<script lang="ts">
	import { type FieldI } from '../types/fieldTypes';
	import { isDisplayField, isInputField } from '../util/isFieldType';
	import DisplayField from './DisplayField.svelte';
	import InputField from './InputField.svelte';

	export let field: FieldI;
</script>

{#if isInputField(field)}
	<InputField bind:field disabled />
{:else if isDisplayField(field)}
	<DisplayField bind:field />
{:else}
	<span>Problem with displaying element.</span>
{/if}
