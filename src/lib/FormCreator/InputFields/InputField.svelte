<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { displayElementTypes, type Field, type FieldType } from '../types/fieldTypes';

	export let field: Field<FieldType>;
	export let value: any;

	const type = field.type;

	const inputType: {
		[type in Partial<
			FieldType[number] | (typeof displayElementTypes)[number]
		>]: HTMLInputTypeAttribute;
	} = {
		address: 'text',
		number: 'text',
		signature: 'text',
		text: 'text',
		h1: 'text',
		h2: 'text',
		'multiple-choice': 'checkbox',
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
</script>

<h4 class="h4 ml-2">{field.name}</h4>

<!-- Single input field types -->
{#if ['text', 'number', 'date', 'time', 'checkbox', 'image', 'file', 'audio', 'video', 'address', 'link', 'h1', 'h2'].includes(type)}
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
