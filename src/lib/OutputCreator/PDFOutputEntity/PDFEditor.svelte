<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import OrderableList from '../../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../../Draggable/stores/draggedSelectable';
	import {
		isDisplayField,
		isInputField,
		isNewInputField
	} from '../../FormCreator/util/isFieldType';
	import FieldGhost from '../../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import OutputField from '../OutputFields/OutputField.svelte';
	import { outputFieldIcons } from '../OutputSelectables/OutputSelectableElementBase.svelte';
	import { getOutputEntityStore, outputEntityFieldsStore } from '../stores/outputEntity';
	import {
		isNewOutputDisplayField,
		isNewOutputInputField,
		isOutputField
	} from '../util/isOutputFieldType';

	const outputEntity = getOutputEntityStore();
	const outputEntityFields = outputEntityFieldsStore(outputEntity);

	$: displayText = isInputField($draggedComponentPayload)
		? $draggedComponentPayload.name
		: isDisplayField($draggedComponentPayload) || isNewInputField($draggedComponentPayload)
			? formatFieldType($draggedComponentPayload.type)
			: '';
</script>

<div
	class="border-surface-400-500-token h-min min-h-14 flex-1 border border-dashed p-2 rounded-token"
>
	<Accordion>
		<!-- TODO: Type is not a valid ID -->
		<OrderableList
			items={$outputEntityFields}
			idField="type"
			addItem={(item) => {
				if (isNewOutputInputField(item) || isNewOutputDisplayField(item)) {
					outputEntity.addField(item.type);
				}
			}}
			removeItem={() => {}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if isNewOutputInputField($draggedComponentPayload) || isNewOutputDisplayField($draggedComponentPayload)}
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
				{#if isNewOutputInputField($draggedComponentPayload) || isNewOutputDisplayField($draggedComponentPayload)}
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
