<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fieldTypeIcons } from '../FormSelectables/SelectableBase.svelte';
	import type { DisplayFieldI, DisplayFieldType } from '../types/fieldTypes';
	import { formatFieldType } from '../util/formatFieldType';
	import FormFieldBase from './FormFieldBase.svelte';

	export let field: DisplayFieldI<DisplayFieldType>;
</script>

<FormFieldBase id={field.id} name={formatFieldType(field.type)}>
	<!-- TODO: Complete -->
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[field.type]} class="h-4 w-4" />
	</svelte:fragment>
</FormFieldBase>
