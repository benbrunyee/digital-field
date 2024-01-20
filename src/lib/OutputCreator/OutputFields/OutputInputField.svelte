<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import type { ExistingOutputInputField, NewOutputInputField } from '../types/outputFieldTypes';
	import { isNewOutputInputField } from '../util/isOutputFieldType';

	export let field: NewOutputInputField | ExistingOutputInputField;

	$: id = isNewOutputInputField(field) ? field.clientId : field.id;

	const dispatch = createEventDispatcher();

	function onInputChanged() {
		dispatch('fieldChanged', true);
	}
</script>

<FieldBase {id} name={formatFieldType(field.type)}>
	<svelte:fragment slot="icon"></svelte:fragment>
</FieldBase>
