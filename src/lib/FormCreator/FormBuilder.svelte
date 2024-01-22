<script lang="ts">
	import { Accordion, getToastStore } from '@skeletonlabs/skeleton';
	import OrderableList from '../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../Draggable/stores/draggedSelectable';
	import FieldGhost from '../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../SelectableElements/util/formatFieldType';
	import { loadForm } from '../util/form/loadForms';
	import { toastError } from '../util/toast/toastError';
	import FormField from './FormFields/FormField.svelte';
	import { fieldTypeIcons } from './FormSelectables/FormSelectableElementBase.svelte';
	import { fieldsStore, getFormStore } from './stores/form';
	import {
		isDisplayField,
		isExistingDisplayField,
		isExistingInputField,
		isField,
		isInputField,
		isNewDisplayField,
		isNewInputField
	} from './util/isFieldType';

	export let formId = '';

	const toastStore = getToastStore();
	const form = getFormStore();
	const fields = fieldsStore(form);

	$: if (formId) {
		new Promise<void>(async (resolve) => {
			try {
				const existingForm = await loadForm(formId);
				$form = existingForm;
			} catch (error) {
				console.error(error);
				toastError(toastStore, 'Failed to load form');
			}

			return resolve();
		});
	}

	$: displayText = isInputField($draggedComponentPayload)
		? $draggedComponentPayload.name || formatFieldType($draggedComponentPayload.type)
		: isNewDisplayField($draggedComponentPayload) || isNewInputField($draggedComponentPayload)
			? formatFieldType($draggedComponentPayload.type)
			: isDisplayField($draggedComponentPayload)
				? formatFieldType($draggedComponentPayload.type)
				: '';

	$: console.log($fields);
</script>

<div class="border-surface-400-500-token h-min min-h-14 w-full border p-2 rounded-token">
	<Accordion>
		<!-- TODO: Orderable list should have an internal ID as well as a dynamic id field -->
		<OrderableList
			items={$form.fields}
			addItem={(item, insertAfter) => {
				// Add a new field
				if (isNewDisplayField(item) || isNewInputField(item)) {
					form.addField(item.type, insertAfter);
					return;
				}

				// Moving an existing field
				if (isExistingDisplayField(item) || isExistingInputField(item)) {
					const newFields = [
						...$form.fields.filter((f) => {
							if (isExistingDisplayField(f) || isExistingInputField(f)) {
								return f.id !== item.id;
							} else if (isNewDisplayField(f) || isNewInputField(f)) {
								return f.clientId !== item.id;
							}

							return true;
						})
					];
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
					if (isExistingInputField(item) || isExistingDisplayField(item)) {
						form.removeField(item.id);
					} else if (isNewDisplayField(item) || isNewInputField(item)) {
						form.removeField(item.clientId);
					}
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
				{#if isNewInputField($draggedComponentPayload) || isNewDisplayField($draggedComponentPayload)}
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
				{#if isNewInputField($draggedComponentPayload) || isNewDisplayField($draggedComponentPayload)}
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
