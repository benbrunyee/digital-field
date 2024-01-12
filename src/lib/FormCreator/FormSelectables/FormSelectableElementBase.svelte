<script lang="ts" context="module">
	export const fieldInputTypeIcons: {
		[k in InputFieldType]: string;
	} = {
		address: 'material-symbols:file-map-outline-rounded',
		audio: 'material-symbols:music-note-rounded',
		checkbox: 'material-symbols:check-box-outline-rounded',
		choice: 'material-symbols:event-list-outline-rounded',
		date: 'material-symbols:calendar-clock-outline-rounded',
		file: 'material-symbols:attach-file-rounded',
		image: 'material-symbols:broken-image-outline-rounded',
		link: 'material-symbols:link-rounded',
		number: 'material-symbols:tag-rounded',
		signature: 'material-symbols:ink-pen-outline-rounded',
		text: 'material-symbols:text-fields-rounded',
		time: 'material-symbols:nest-clock-farsight-analog-outline-rounded',
		multiple_choice: 'material-symbols:checklist-rounded',
		video: 'material-symbols:hangout-video-outline-rounded',
		'multi-entry': 'material-symbols:ad-group-outline-rounded'
	};

	export const fieldDisplayTypeIcons: {
		[k in DisplayFieldType]: string;
	} = {
		heading: 'material-symbols:format-color-text-rounded',
		subheading: 'material-symbols:format-color-text-rounded',
		separator: 'material-symbols:space-bar-rounded',
		paragraph: 'material-symbols:format-color-text-rounded'
	};

	export const fieldTypeIcons: {
		[k in FormFieldTypes]: string;
	} = {
		...fieldInputTypeIcons,
		...fieldDisplayTypeIcons
	};

	export const fieldTooltipText: {
		[k in FormFieldTypes]: string;
	} = {
		multiple_choice: 'A question with multiple choices. The user can select one or more options.',
		address: 'Allows the user to enter an address.',
		audio: 'Upload an audio file.',
		checkbox: 'A question with a yes/no answer.',
		choice: 'A question with multiple choices. The user can select one option.',
		date: 'Allows the user to enter a date.',
		file: 'Upload a file.',
		image: 'Upload an image.',
		link: 'Allows the user to enter a link.',
		number: 'Allows the user to enter a number.',
		signature: 'Allows the user to enter a signature.',
		text: 'Allows the user to enter text.',
		time: 'Allows the user to enter a time.',
		video: 'Upload a video.',
		heading: 'A heading.',
		subheading: 'A subheading.',
		separator: 'A horizontal line.',
		'multi-entry': 'Define a structure that can be repeated multiple times.',
		paragraph: 'A paragraph.'
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import SelectableBase from '../../SelectableElements/SelectableBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import {
		type DisplayFieldType,
		type FormFieldTypes,
		type InputFieldType
	} from '../types/fieldTypes';

	export let type: FormFieldTypes;
	export let tooltip = true;
</script>

<SelectableBase {tooltip} class={$$props.class ?? ''}>
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[type]} class="inline h-4 w-4 group-hover:text-primary-500" />
	</svelte:fragment>

	{formatFieldType(type)}

	<svelte:fragment slot="tooltip">
		{fieldTooltipText[type]}
	</svelte:fragment>
</SelectableBase>
