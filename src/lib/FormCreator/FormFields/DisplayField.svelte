<script lang="ts">
	import Icon from '@iconify/svelte';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import { fieldTypeIcons } from '../FormSelectables/FormSelectableElementBase.svelte';
	import type { DisplayFieldI, DisplayFieldType } from '../types/fieldTypes';

	export let field: DisplayFieldI<DisplayFieldType>;
</script>

<FieldBase id={field.id} name={formatFieldType(field.type)}>
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[field.type]} class="h-4 w-4" />
	</svelte:fragment>
</FieldBase>
