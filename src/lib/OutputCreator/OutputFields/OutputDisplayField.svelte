<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FieldBase from '../../Fields/FieldBase.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import type { OutputDisplayFieldI, OutputDisplayFieldType } from '../types/outputFieldTypes';

	export let field: OutputDisplayFieldI<OutputDisplayFieldType>;

	const dispatch = createEventDispatcher();

	function onInputChanged() {
		dispatch('fieldChanged', true);
	}
</script>

<FieldBase id={field.id} name={formatFieldType(field.type)}>
	<svelte:fragment slot="icon"></svelte:fragment>
</FieldBase>
