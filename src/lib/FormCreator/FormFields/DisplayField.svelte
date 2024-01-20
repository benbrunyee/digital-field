<script lang="ts">
	import Icon from '@iconify/svelte';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import { fieldTypeIcons } from '../FormSelectables/FormSelectableElementBase.svelte';
	import type { ExistingDisplayField, NewDisplayField } from '../types/fieldTypes';
	import { isExistingDisplayField } from '../util/isFieldType';

	export let field: ExistingDisplayField | NewDisplayField;

	$: id = isExistingDisplayField(field) ? field.id : field.clientId;
</script>

<FieldBase {id} name={formatFieldType(field.type)}>
	<svelte:fragment slot="icon">
		<Icon icon={fieldTypeIcons[field.type]} class="h-4 w-4" />
	</svelte:fragment>
</FieldBase>
