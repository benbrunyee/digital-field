<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import OrderableList from '../../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../../Draggable/stores/draggedSelectable';
	import { fieldTypeIcons } from '../../FormCreator/FormSelectables/FormSelectableElementBase.svelte';
	import FieldGhost from '../../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
	import { outputFieldIcons } from '../OutputSelectables/OutputSelectableElementBase.svelte';
	import { outputEntityStore } from '../stores/outputEntity';

	const outputEntity = getContext<ReturnType<typeof outputEntityStore>>('outputEntityStore');

	$: displayText = $draggedComponentPayload.name ?? formatFieldType($draggedComponentPayload.type);
</script>

<!-- TODO: Complete this -->
<div
	class="border-surface-800-100-token h-min min-h-14 flex-1 border border-dashed p-2 rounded-token"
>
	<Accordion>
		<OrderableList
			items={$outputEntity.fields}
			idField="id"
			addItem={(item) => {
				console.log(item);
				$outputEntity.fields.push(item.payload);
			}}
			removeItem={() => {}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if $draggedComponentPayload.newField && $draggedComponentPayload.type === 'text'}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{:else}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if $draggedComponentPayload.newField && $draggedComponentPayload.type === 'text'}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{:else}
					<FieldGhost
						icon={outputFieldIcons?.[$draggedComponentPayload.type] ||
							fieldTypeIcons[$draggedComponentPayload.type]}
					>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="content" let:item></svelte:fragment>
		</OrderableList>
	</Accordion>
</div>
