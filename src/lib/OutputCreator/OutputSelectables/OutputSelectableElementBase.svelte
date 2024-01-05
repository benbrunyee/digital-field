<script lang="ts" context="module">
	export const outputFieldIcons: {
		[k in Extract<OutputFieldType, OutputDisplayFieldType>]: string;
	} = {
		heading: 'material-symbols:format-color-text-rounded',
		subheading: 'material-symbols:format-color-text-rounded',
		divider: 'material-symbols:align-space-even-rounded'
	};

	export const outputFieldTooltipText: {
		[k in OutputDisplayFieldType]: string;
	} = {
		heading: 'A heading.',
		subheading: 'A subheading.',
		divider: 'A horizontal line.'
	};
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fieldTypeIcons } from '../../FormCreator/FormSelectables/FormSelectableElementBase.svelte';
	import SelectableBase from '../../SelectableElements/SelectableBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import type { OutputDisplayFieldType, OutputFieldType } from '../types/outputFieldTypes';

	export let tooltip = true;
	export let name = undefined;
	export let type: OutputFieldType;
</script>

<SelectableBase {tooltip} class={$$props.class ?? ''}>
	<svelte:fragment slot="icon">
		<Icon
			icon={Object.keys(outputFieldIcons).includes(type)
				? outputFieldIcons[type]
				: Object.keys(fieldTypeIcons).includes(type)
					? fieldTypeIcons[type]
					: 'material-symbols:warning-rounded'}
			class="inline h-4 w-4 group-hover:text-primary-500"
		/>
	</svelte:fragment>

	{name ?? formatFieldType(type)}

	<svelte:fragment slot="tooltip">
		{outputFieldTooltipText[type]}
	</svelte:fragment>
</SelectableBase>
