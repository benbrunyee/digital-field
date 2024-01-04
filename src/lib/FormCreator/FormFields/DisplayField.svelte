<script lang="ts">
	import type { DisplayFieldI, DisplayFieldType } from '../types/fieldTypes';
	import { formatFieldType } from '../util/formatFieldType';
	import FormFieldBase from './FormFieldBase.svelte';

	export let field: DisplayFieldI<DisplayFieldType>;
</script>

<FormFieldBase name={formatFieldType(field.type)}>
	<!-- TODO: Complete -->
</FormFieldBase>
