<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import OrderableList from '../../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../../Draggable/stores/draggedSelectable';
	import { fieldTypeIcons } from '../../FormCreator/FormSelectables/FormSelectableElementBase.svelte';
	import {
		isDisplayField,
		isField,
		isInputField,
		isNewField
	} from '../../FormCreator/util/isFieldType';
	import FieldGhost from '../../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import OutputField from '../OutputFields/OutputField.svelte';
	import { outputFieldIcons } from '../OutputSelectables/OutputSelectableElementBase.svelte';
	import { getOutputEntityStore, outputEntityFieldsStore } from '../stores/outputEntity';
	import { isOutputField } from '../util/isOutputFieldType';

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
				if (isOutputField(item)) {
					outputEntity.addField(item.type);
				}
			}}
			removeItem={() => {}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if isNewField($draggedComponentPayload)}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{:else if isField($draggedComponentPayload)}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if isNewField($draggedComponentPayload)}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{:else if isField($draggedComponentPayload)}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
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
