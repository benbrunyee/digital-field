<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import type {
		ExistingOutputDisplayField,
		NewOutputDisplayField
	} from '../types/outputFieldTypes';
	import { isNewOutputDisplayField } from '../util/isOutputFieldType';

	export let field: ExistingOutputDisplayField | NewOutputDisplayField;

	$: id = isNewOutputDisplayField(field) ? field.clientId : field.id;

	const dispatch = createEventDispatcher();

	function onInputChanged() {
		dispatch('fieldChanged', true);
	}
</script>

<FieldBase {id} name={formatFieldType(field.type)}>
	<svelte:fragment slot="icon"></svelte:fragment>
</FieldBase>
