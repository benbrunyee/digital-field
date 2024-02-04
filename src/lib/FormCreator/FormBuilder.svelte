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

	const addField = (item: unknown, insertAfter: number) => {
		if (
			isNewDisplayField(item) ||
			isNewInputField(item) ||
			isExistingDisplayField(item) ||
			isExistingInputField(item)
		) {
			const formHasItem = $form.fields.some((field) => {
				if (
					(isExistingDisplayField(field) || isExistingInputField(field)) &&
					(isExistingInputField(item) || isExistingDisplayField(item))
				) {
					return field.id === item.id;
				}

				if (
					(isNewDisplayField(field) || isNewInputField(field)) &&
					(isNewInputField(item) || isNewDisplayField(item))
				) {
					return field.clientId === item.clientId;
				}

				return false;
			});

			if (formHasItem) {
				console.debug(
					'Moving existing field',
					'id' in item ? item.id : item.clientId,
					'to',
					insertAfter
				);

				const newFields = $form.fields.filter((field) => {
					if ((isExistingDisplayField(field) || isExistingInputField(field)) && 'id' in item) {
						return field.id !== item.id;
					}

					if ((isNewDisplayField(field) || isNewInputField(field)) && 'clientId' in item) {
						return field.clientId !== item.clientId;
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
			} else {
				console.debug('Adding new field', item.type, 'to', insertAfter);
				form.addField(item.type, insertAfter);
				return;
			}
		}

		console.error('Item is not a new or existing field', item);
		toastStore.trigger({
			message: 'Something went wrong!',
			background: 'bg-error-500'
		});
	};

	const removeField = (item: unknown) => {
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
	};

	const fieldKeyGenerator = (item: unknown) => {
		if (isExistingDisplayField(item) || isExistingInputField(item)) {
			return item.id;
		} else if (isNewDisplayField(item) || isNewInputField(item)) {
			return item.clientId;
		}

		// We should never get here
		console.error('Failed to generate key for field', item);
		toastError(toastStore, 'Something went wrong!');
		return createId();
	};
</script>

<div class="border-surface-400-500-token h-min min-h-14 w-full border p-2 rounded-token">
	<Accordion>
		<OrderableList
			items={$form.fields}
			keyGenerator={fieldKeyGenerator}
			addItem={addField}
			removeItem={removeField}
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
