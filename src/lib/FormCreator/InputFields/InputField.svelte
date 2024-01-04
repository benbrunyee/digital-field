<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { type InputField, type InputFieldType } from '../types/fieldTypes';

	export let field: InputField<InputFieldType>;
	export let value: any;

	const type = field.type;

	const inputType: {
		[k in InputFieldType]: HTMLInputTypeAttribute;
	} = {
		address: 'text',
		number: 'text',
		signature: 'text',
		text: 'text',
		multiple_choice: 'checkbox',
		checkbox: 'checkbox',
		choice: 'radio',
		audio: 'file',
		file: 'file',
		date: 'date',
		image: 'image',
		link: 'url',
		time: 'time',
		video: 'file'
	};

	const singleInputFields: InputFieldType[] = [
		'text',
		'number',
		'date',
		'time',
		'checkbox',
		'image',
		'file',
		'audio',
		'video',
		'address',
		'link'
	];
</script>

<h4 class="h4 ml-2">{field.name}</h4>

<!-- Single input field types -->
{#if singleInputFields.includes(type)}
	<input
		type={inputType[type]}
		class="input variant-glass"
		on:change={(e) => {
			// We do not use bind:value here because we want to be able to dynamically
			// change the "type" prop of the input.
			value = e.currentTarget.value;
		}}
	/>
{:else}
	<span>Problem with type: {type}</span>
{/if}
