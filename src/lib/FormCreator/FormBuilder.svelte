<script lang="ts">
	import { Accordion, getToastStore } from '@skeletonlabs/skeleton';
	import OrderableList from '../Draggable/OrderableList.svelte';
	import { draggedComponentPayload } from '../Draggable/stores/draggedSelectable';
	import FieldGhost from '../SelectableElements/FieldGhost.svelte';
	import { formatFieldType } from '../SelectableElements/util/formatFieldType';
	import { createId } from '../util/createId';
	import { loadForm } from '../util/form/loadForms';
	import { toastError } from '../util/toast/toastNotifications';
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

				if (!existingForm) {
					toastError(toastStore, 'Form not found');
					return resolve();
				}

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
</script>

<div class="border-surface-400-500-token h-min min-h-14 w-full border p-2 rounded-token">
	<Accordion>
		<OrderableList
			items={$form.fields}
			keyGenerator={(item) => {
				if (isExistingDisplayField(item) || isExistingInputField(item)) {
					return item.id;
				} else if (isNewDisplayField(item) || isNewInputField(item)) {
					return item.clientId;
				}

				// We should never get here
				console.error('Failed to generate key for field', item);
				toastError(toastStore, 'Something went wrong!');
				return createId();
			}}
			addItem={(item, insertAfter) => {
				// Add a new field
				if (isNewDisplayField(item) || isNewInputField(item)) {
					console.debug('Adding new field', item.type, 'to', insertAfter);
					form.addField(item.type, insertAfter);
					return;
				}

				// Moving an existing field
				if (isExistingDisplayField(item) || isExistingInputField(item)) {
					console.debug('Moving existing field', item.id, 'to', insertAfter);

					const newFields = $form.fields.filter((field) => {
						if (isExistingDisplayField(field)) {
							return field.id !== item.id;
						}

						if (isExistingInputField(field)) {
							return field.id !== item.id;
						}

						return true;
					});

					// If index is -1, then we want to insert at the beginning
					if (insertAfter === -1) {
						newFields.unshift(item);
						$form.fields = newFields;
						return;
					}

					newFields.splice(insertAfter, 0, item);
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
				if (isExistingInputField(item) || isExistingDisplayField(item)) {
					console.debug('Removing existing field', item.id);
					form.removeField(item.id);
					return;
				}

				if (isNewDisplayField(item) || isNewInputField(item)) {
					console.debug('Removing new field', item.clientId);
					form.removeField(item.clientId);
					return;
				}

				console.error('Item is not an existing field', item);
				toastStore.trigger({
					message: 'Something went wrong!',
					background: 'bg-error-500'
				});
			}}
		>
			<svelte:fragment slot="placeholderGhost">
				{#if isField($draggedComponentPayload)}
					<FieldGhost icon={fieldTypeIcons[$draggedComponentPayload.type]}>
						{displayText}
					</FieldGhost>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="draggedGhost">
				{#if isField($draggedComponentPayload)}
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
