<script lang="ts">
	import { Accordion, getToastStore } from '@skeletonlabs/skeleton';
	import OrderableList from '../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../Draggable/stores/draggedSelectable';
	import FieldGhost from '../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../SelectableElements/util/formatFieldType';
	import FormField from './FormFields/FormField.svelte';
	import { fieldTypeIcons } from './FormSelectables/FormSelectableElementBase.svelte';
	import { getFormStore } from './stores/form';
	import { isDisplayField, isField, isInputField, isNewField } from './util/isFieldType';

	const form = getFormStore();

	const toastStore = getToastStore();

	$: displayText = isInputField($draggedComponentPayload)
		? $draggedComponentPayload.name || formatFieldType($draggedComponentPayload.type)
		: isNewField($draggedComponentPayload)
			? formatFieldType($draggedComponentPayload.type)
			: isDisplayField($draggedComponentPayload)
				? formatFieldType($draggedComponentPayload.type)
				: '';

	$: console.log($form.fields);
</script>

<div class="border-surface-800-100-token h-min min-h-14 w-full border p-2 rounded-token">
	<Accordion>
		<OrderableList
			items={$form.fields}
			idField="id"
			addItem={(item, insertAfter) => {
				// Add a new field
				if (isNewField(item)) {
					form.addField(item.type, insertAfter);
					return;
				}

				// Moving an existing field
				if (isField(item)) {
					const newFields = [...$form.fields.filter((f) => f.id !== item.id)];
					newFields.splice(insertAfter + 1, 0, item);
					$form.fields = newFields;
					return;
				}

				console.error('Item is not a new or existing field', item);
				toastStore.trigger({
					message: 'Something went wrong!',
					background: 'bg-error-500'
				});
			}}
			removeItem={(item) => {
				if (isField(item)) {
					form.removeField(item.id);
				} else {
					console.error('Item is not an existing field', item);
					toastStore.trigger({
						message: 'Something went wrong!',
						background: 'bg-error-500'
					});
				}
			}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if isNewField($draggedComponentPayload)}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{:else if isField($draggedComponentPayload)}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if isNewField($draggedComponentPayload)}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{:else if isField($draggedComponentPayload)}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="content" let:item>
				<FormField bind:field={$form.fields[item.i]} />
			</svelte:fragment>
		</OrderableList>
	</Accordion>
</div>
