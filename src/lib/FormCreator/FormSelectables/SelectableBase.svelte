<script lang="ts" context="module">
	export const fieldTypeIcons: {
		[k in FieldTypes]: string;
	} = {
		multiple_choice: 'material-symbols:checklist-rounded',
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
		video: 'material-symbols:hangout-video-outline-rounded',
		heading: 'material-symbols:format-color-text-rounded',
		subheading: 'material-symbols:format-color-text-rounded',
		separator: 'material-symbols:space-bar-rounded'
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { type FieldTypes } from '../types/fieldTypes';
	import { formatFieldType } from '../util/formatFieldType';

	export let type: FieldTypes;
	export let tooltip = true;

	const fieldTooltipText: {
		[k in FieldTypes]: string;
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
		separator: 'A horizontal line.'
	};

	const popupHover: PopupSettings = {
		event: 'hover',
		target: `popupHover-${type}`,
		placement: 'right'
	};
</script>

<div
	class="group bg-surface-50-900-token border-surface-300-600-token flex cursor-pointer select-none flex-nowrap items-center justify-between p-2 px-4 border-token rounded-token {$$props.class}"
>
	<div class="flex items-center space-x-1">
		<Icon icon={fieldTypeIcons[type]} class="inline h-4 w-4 group-hover:text-primary-500" />
		<span class="text-sm group-hover:text-primary-500">{formatFieldType(type)}</span>
	</div>
	{#if tooltip}
		<div use:popup={popupHover} class="[&>*]:pointer-events-none">
			<Icon icon="material-symbols:info-outline-rounded" class="ml-auto h-4 w-4" />
		</div>
		<div data-popup="popupHover-{type}" class="card bg-surface-800-100-token p-2">
			<p class="text-surface-100-800-token text-xs">{fieldTooltipText[type]}</p>
		</div>
	{/if}
</div>
