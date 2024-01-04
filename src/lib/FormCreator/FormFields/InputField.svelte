<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import { fieldTypeIcons } from '../FormSelectables/SelectableBase.svelte';
	import { type InputFieldI, type InputFieldType } from '../types/fieldTypes';
	import FormFieldBase from './FormFieldBase.svelte';

	export let field: InputFieldI<InputFieldType>;

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
		image: 'file',
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

<FormFieldBase bind:name={field.name}>
	<!-- Single input field types -->
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[field.type]} class="h-4 w-4" />
	</svelte:fragment>
	{#if singleInputFields.includes(type)}
		<input
			{...$$restProps}
			type={inputType[type]}
			class="input variant-glass"
			on:change={(e) => {
				// We do not use bind:value here because we want to be able to dynamically
				// change the "type" prop of the input.
				field.value = e.currentTarget.value;
			}}
		/>
	{:else}
		<span>Problem with type: {type}</span>
	{/if}
</FormFieldBase>
