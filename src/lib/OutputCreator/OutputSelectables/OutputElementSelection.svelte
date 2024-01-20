<script lang="ts">
	import FixedList from '../../Draggable/FixedList.svelte';
	import { getFormStore, inputFieldsStore } from '../../FormCreator/stores/form';
	import { isInputField } from '../../FormCreator/util/isFieldType';
	import { outputDisplayFieldTypes } from '../types/outputFieldTypes';
	import { isOutputDisplayField } from '../util/isOutputFieldType';
	import OutputSelectableElementBase from './OutputSelectableElementBase.svelte';

	// We don't want to allow the user to select form display elements for the output structure
	const formStore = getFormStore();

	const inputFields = inputFieldsStore(formStore);
</script>

<div class="space-y-2">
	<h3 class="h3 ml-2">Form Elements</h3>
	<hr />

	<FixedList
		items={$inputFields.map((x) => ({
			...x,
			newField: true
		}))}
	>
		<svelte:fragment slot="draggedGhost" let:item>
			{#if isInputField(item)}
				<OutputSelectableElementBase
					class="border-dashed !border-primary-500 !text-primary-500"
					type={item.type}
					name={item.name}
					tooltip={Boolean(item.description)}
					tooltipText={item.description}
				/>
			{:else if isOutputDisplayField(item)}
				<OutputSelectableElementBase class="hover:!border-primary-500" type={item.type} />
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="content" let:item>
			{#if isInputField(item)}
				<OutputSelectableElementBase
					class="hover:!border-primary-500"
					type={item.type}
					name={item.name}
					tooltip={Boolean(item.description)}
					tooltipText={item.description}
				/>
			{:else if isOutputDisplayField(item)}
				<OutputSelectableElementBase class="hover:!border-primary-500" type={item.type} />
			{/if}
		</svelte:fragment>
	</FixedList>

	<h3 class="h3 ml-2">Display Elements</h3>
	<hr />

	<FixedList
		items={outputDisplayFieldTypes.map((x) => ({
			type: x,
			newField: true
		}))}
	>
		<svelte:fragment slot="draggedGhost" let:item>
			<OutputSelectableElementBase
				class="border-dashed !border-primary-500 !text-primary-500"
				tooltip={false}
				type={item.type}
			/>
		</svelte:fragment>

		<svelte:fragment slot="content" let:item>
			<OutputSelectableElementBase class="hover:!border-primary-500" type={item.type} />
		</svelte:fragment>
	</FixedList>
</div>
