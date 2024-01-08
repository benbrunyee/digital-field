<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import OrderableList from '../../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../../Draggable/stores/draggedSelectable';
	import { isDisplayField, isInputField, isNewField } from '../../FormCreator/util/isFieldType';
	import FieldGhost from '../../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import OutputField from '../OutputFields/OutputField.svelte';
	import { outputFieldIcons } from '../OutputSelectables/OutputSelectableElementBase.svelte';
	import { getOutputEntityStore, outputEntityFieldsStore } from '../stores/outputEntity';
	import { isNewOutputField, isOutputField } from '../util/isOutputFieldType';

	const outputEntity = getOutputEntityStore();
	const outputEntityFields = outputEntityFieldsStore(outputEntity);

	$: displayText = isInputField($draggedComponentPayload)
		? $draggedComponentPayload.name
		: isDisplayField($draggedComponentPayload) || isNewField($draggedComponentPayload)
			? formatFieldType($draggedComponentPayload.type)
			: '';
</script>

<div
	class="border-surface-800-100-token h-min min-h-14 flex-1 border border-dashed p-2 rounded-token"
>
	<Accordion>
		<OrderableList
			items={$outputEntityFields}
			idField="id"
			addItem={(item) => {
				if (isNewOutputField(item)) {
					outputEntity.addField(item.type);
				}
			}}
			removeItem={() => {}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if isNewOutputField($draggedComponentPayload)}
					<FieldGhost icon={outputFieldIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{:else if isOutputField($draggedComponentPayload)}
					<FieldGhost icon={outputFieldIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if isNewOutputField($draggedComponentPayload)}
					<FieldGhost icon={outputFieldIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{:else if isOutputField($draggedComponentPayload)}
					<FieldGhost icon={outputFieldIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="content" let:item>
				<OutputField bind:field={$outputEntity.fields[item.i]} />
			</svelte:fragment>
		</OrderableList>
	</Accordion>
</div>
