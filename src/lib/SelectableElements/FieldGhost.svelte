<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fieldTypeIcons } from '../FormCreator/FormSelectables/FormSelectableElementBase.svelte';
	import type { AllFieldTypes } from './types/fieldTypes';
	import { formatFieldType } from './util/formatFieldType';

	export let type: AllFieldTypes;
</script>

<div class="bg-surface-200-700-token flex flex-row items-center space-x-2 px-4 py-2 rounded-token">
	<Icon icon={fieldTypeIcons[type]} class="h-4 w-4" />
	<span>{formatFieldType(type)}</span>
</div>
