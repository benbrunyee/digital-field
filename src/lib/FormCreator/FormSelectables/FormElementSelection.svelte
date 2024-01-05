<script lang="ts">
	import Draggable from '../../Draggable/Draggable.svelte';
	import { displayFieldTypes, inputFieldTypes } from '../types/fieldTypes';
	import FormSelectableElementBase from './FormSelectableElementBase.svelte';
</script>

<h3 class="h3 ml-2">Input Elements</h3>
<hr />

{#each inputFieldTypes as type}
	<Draggable {type}>
		<FormSelectableElementBase class="hover:!border-primary-500" {type} />

		<svelte:fragment slot="ghost">
			<FormSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				{type}
			/>
		</svelte:fragment>
	</Draggable>
{/each}

<h3 class="h3 ml-2">Display Elements</h3>
<hr />

{#each displayFieldTypes as type}
	<Draggable {type}>
		<FormSelectableElementBase class="hover:!border-primary-500" {type} />

		<svelte:fragment slot="ghost">
			<FormSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				{type}
			/>
		</svelte:fragment>
	</Draggable>
{/each}
