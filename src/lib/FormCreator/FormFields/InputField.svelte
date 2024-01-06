<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { fieldTypeIcons } from '../FormSelectables/FormSelectableElementBase.svelte';
	import { type InputFieldI, type InputFieldType } from '../types/fieldTypes';

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

	const dispatch = createEventDispatcher();

	function onInputChanged() {
		dispatch('fieldChanged', true);
	}
</script>

<FieldBase id={field.id} bind:name={field.name}>
	<!-- Single input field types -->
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[field.type]} class="h-4 w-4" />
	</svelte:fragment>

	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim">Description</div>
		<input type="text" bind:value={field.description} on:input={onInputChanged} />
	</div>

	{#if singleInputFields.includes(type)}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Default value</div>
			<input
				type={inputType[type]}
				placeholder="Placeholder"
				class={inputType[type] === 'file' ? 'px-2 py-1' : ''}
				on:input={(e) => {
					// We do not use bind:value here because we want to be able to dynamically
					// change the "type" prop of the input.
					field.placeholder = e.currentTarget.value;
					onInputChanged();
				}}
			/>
		</div>
	{:else}
		<span class="text-error-500-400-token"
			>There was a problem displaying the options with type: {type}</span
		>
	{/if}
</FieldBase>
