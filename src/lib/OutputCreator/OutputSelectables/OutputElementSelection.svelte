<script lang="ts">
	import Draggable from '../../Draggable/Draggable.svelte';
	import { getFormStore } from '../../FormCreator/stores/form';
	import { filterForInputField } from '../../FormCreator/util/filterForFieldType';
	import { outputDisplayFieldTypes } from '../types/outputFieldTypes';
	import OutputSelectableElementBase from './OutputSelectableElementBase.svelte';

	const formStore = getFormStore();

	console.log($formStore);

	// We don't want to allow the user to select form display elements for the output structure
	$: inputFields = $formStore.fields.filter(filterForInputField);

	$: console.log(inputFields);
</script>

<h3 class="h3 ml-2">Form Elements</h3>
<hr />

{#each inputFields as field}
	<OutputSelectableElementBase type={field.type} name={field.name} />
{/each}

<h3 class="h3 ml-2">Display Elements</h3>
<hr />

{#each outputDisplayFieldTypes as type}
	<Draggable {type}>
		<OutputSelectableElementBase class="hover:!border-primary-500" {type} />

		<svelte:fragment slot="ghost">
			<OutputSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				{type}
			/>
		</svelte:fragment>
	</Draggable>
{/each}
