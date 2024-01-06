<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import OrderableList from '../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../Draggable/stores/draggedSelectable';
	import FieldGhost from '../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../SelectableElements/util/formatFieldType';
	import FormField from './FormFields/FormField.svelte';
	import { fieldTypeIcons } from './FormSelectables/FormSelectableElementBase.svelte';
	import { getFormStore } from './stores/form';

	const form = getFormStore();
</script>

<div
	class="border-surface-800-100-token h-min min-h-14 w-full border border-dashed p-2 rounded-token"
>
	<Accordion>
		<OrderableList
			items={$form.fields}
			idField="id"
			addItem={(item, insertAfter) => {
				// TODO: Check types
				console.log(item);
			}}
			removeItem={(item) => {
				console.log(item);
			}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if $draggedComponentPayload.newField && $draggedComponentPayload.type === 'text'}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{formatFieldType($draggedComponentPayload.type)}
					</FieldGhost>
				{:else}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{$draggedComponentPayload.name ?? $draggedComponentPayload.type}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if $draggedComponentPayload.newField && $draggedComponentPayload.type === 'text'}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{$draggedComponentPayload.name
							? $draggedComponentPayload.name
							: formatFieldType($draggedComponentPayload.type)}
					</FieldGhost>
				{:else}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{$draggedComponentPayload.name ?? $draggedComponentPayload.type}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="content" let:item>
				<FormField bind:field={$form.fields[item.i]} />
			</svelte:fragment>
		</OrderableList>
	</Accordion>
</div>
