<script lang="ts" context="module">
	export const outputDisplayTypeIcons: {
		[k in OutputDisplayFieldType]: string;
	} = {
		heading: 'material-symbols:format-color-text-rounded',
		subheading: 'material-symbols:format-color-text-rounded',
		divider: 'material-symbols:align-space-even-rounded',
		html: 'material-symbols:code-rounded'
	};

	export const outputFieldIcons: {
		[k in OutputFieldType]: string;
	} = {
		...outputDisplayTypeIcons,
		...fieldInputTypeIcons
	};

	export const outputFieldTooltipText: {
		[k in OutputDisplayFieldType]: string;
	} = {
		heading: 'A heading.',
		subheading: 'A subheading.',
		divider: 'A horizontal line.',
		html: "Custom HTML. You can use the form's data in your HTML by using the following syntax: <code>{data:fieldName}</code>."
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fieldInputTypeIcons } from '../../FormCreator/FormSelectables/FormSelectableElementBase.svelte';
	import SelectableBase from '../../SelectableElements/SelectableBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import type { OutputDisplayFieldType, OutputFieldType } from '../types/outputFieldTypes';

	export let tooltip = true;
	export let tooltipText: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let type: OutputFieldType;

	function isTypeInOutputFieldTooltipText(t: string): t is keyof typeof outputFieldTooltipText {
		return type in outputFieldTooltipText;
	}
</script>

<SelectableBase {tooltip} class={$$props.class ?? ''}>
	<svelte:fragment slot="icon">
		<Icon icon={outputFieldIcons[type]} class="inline h-4 w-4 group-hover:text-primary-500" />
	</svelte:fragment>

	{name ?? formatFieldType(type)}

	<svelte:fragment slot="tooltip">
		{tooltipText ?? (isTypeInOutputFieldTooltipText(type) ? outputFieldTooltipText[type] : 'N/A')}
	</svelte:fragment>
</SelectableBase>
