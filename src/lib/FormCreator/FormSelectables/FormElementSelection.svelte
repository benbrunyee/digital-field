<script lang="ts">
	import FixedList from '../../Draggable/FixedList.svelte';
	import { displayFieldTypes, inputFieldTypes } from '../types/fieldTypes';
	import FormSelectableElementBase from './FormSelectableElementBase.svelte';
</script>

<div class="space-y-2">
	<h3 class="h3 ml-2">Input Elements</h3>
	<hr />

	<FixedList
		items={inputFieldTypes.map((x) => ({
			type: x,
			newField: true
		}))}
	>
		<svelte:fragment slot="draggedGhost" let:item>
			<FormSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				type={item.type}
			/>
		</svelte:fragment>

		<svelte:fragment slot="content" let:item>
			<FormSelectableElementBase class="hover:!border-primary-500" type={item.type} />
		</svelte:fragment>
	</FixedList>

	<h3 class="h3 ml-2">Display Elements</h3>
	<hr />

	<FixedList
		items={displayFieldTypes.map((x) => ({
			type: x,
			newField: true
		}))}
	>
		<svelte:fragment slot="draggedGhost" let:item>
			<FormSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				type={item.type}
			/>
		</svelte:fragment>

		<svelte:fragment slot="content" let:item>
			<FormSelectableElementBase class="hover:!border-primary-500" type={item.type} />
		</svelte:fragment>
	</FixedList>
</div>
