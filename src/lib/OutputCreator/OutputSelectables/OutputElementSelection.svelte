<script lang="ts">
	import Draggable from '../../Draggable/Draggable.svelte';
	import { outputDisplayFieldTypes } from '../types/outputFieldTypes';
	import OutputSelectableElementBase from './OutputSelectableElementBase.svelte';
</script>

<h3 class="h3 ml-2">Form Elements</h3>
<hr />

{#each [] as type}
	<OutputSelectableElementBase {type} />
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
