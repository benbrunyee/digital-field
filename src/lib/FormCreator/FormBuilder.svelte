<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import { setContext } from 'svelte';
	import FormField from './FormFields/FormField.svelte';
	import FormFieldGhost from './FormFields/FormFieldGhost.svelte';
	import { draggedComponent, draggedCoordinates, isDragging } from './stores/draggedSelectable';
	import { formStore } from './stores/form';
	import {
		inputFieldTypes,
		type FieldTypes,
		type InputFieldI,
		type InputFieldType
	} from './types/fieldTypes';
	import { formatFieldType } from './util/formatFieldType';

	// Set the form store in the context
	setContext('formStore', formStore);

	// Index: [top, bottom]
	// Stores the top and bottom bounds of each field
	// This is used to determined where to insert a new field when it is dropped
	let measurements = new Map<number, [number, number]>();

	let componentGhost: {
		show: boolean;
		// Use -1 for beginning of form
		showAfterIndex: number | undefined;
		type: FieldTypes | undefined;
	} = {
		show: false,
		showAfterIndex: undefined,
		type: undefined
	};

	function clearGhost() {
		componentGhost.show = false;
		componentGhost.showAfterIndex = undefined;
		componentGhost.type = undefined;
	}

	function formDropzone(node: HTMLDivElement) {
		let nodeBoundingRect = node.getBoundingClientRect();

		let droppedSubscriber = isDragging.subscribe((value) => {
			if (!value && node && $draggedCoordinates) {
				const { x, y } = $draggedCoordinates;

				// Check if the coordinated are inside the form element
				if (
					x >= nodeBoundingRect.left &&
					x <= nodeBoundingRect.right &&
					y >= nodeBoundingRect.top
					// We don't check if the drop is below the form since this will just add
					// the element to the end of the form
				) {
					console.log('Mouse is inside the form element');
					// TODO: Add the element to the form

					if (!$draggedComponent) return;

					if ($draggedComponent.new) {
						// Add a new field
						formStore.addField(
							{
								type: $draggedComponent.fieldType,
								createdAt: undefined,
								updatedAt: undefined,
								options: undefined,
								...(inputFieldTypes.includes($draggedComponent.fieldType as InputFieldType) &&
									<InputFieldI<InputFieldType>>{
										name: `${formatFieldType($draggedComponent.fieldType)} Field`
									})
							},
							componentGhost.showAfterIndex + 1
						);

						console.log("Added field to form's fields", componentGhost);

						// We clear the dragged component so that it doesn't get added again if the
						// state changes unexpectedly
						draggedComponent.clearDragged();
					} else {
						// Move an existing field
					}

					clearGhost();
				}
			}
		});

		let onMouseMoveSubsriber = draggedCoordinates.subscribe((mouseCoordinates) => {
			if (!mouseCoordinates) return;

			// Test to see if coordinates are in dropzone
			if (
				!(
					mouseCoordinates.x >= nodeBoundingRect.left &&
					mouseCoordinates.x <= nodeBoundingRect.right &&
					mouseCoordinates.y >= nodeBoundingRect.top
				)
				// We don't check if the drop is below the form since this will just add
				// the element to the end of the form
			) {
				clearGhost();
				return;
			}

			// Find the index of the field that the mouse is over
			// TODO: Split search into two halves to improve performance
			let index = Array.from(measurements.entries()).findLastIndex(([_, [top, bottom]]) => {
				// We don't divide (bottom - top) by 2 because the ghost element itself will shift the list down
				return mouseCoordinates.y >= bottom - top + top;
			});

			// If the mouse is over a field, show the ghost element
			componentGhost = {
				show: true,
				showAfterIndex: index,
				type:
					$draggedComponent?.new === true
						? $draggedComponent.fieldType
						: (componentGhost.type = $draggedComponent.field.type)
			};
		});

		return {
			destroy() {
				droppedSubscriber?.();
				onMouseMoveSubsriber?.();
			}
		};
	}

	function measureTopBottomFields(node: HTMLDivElement, index: number) {
		let nodeBoundingRect = node.getBoundingClientRect();
		measurements.set(index, [nodeBoundingRect.top, nodeBoundingRect.bottom]);

		return {
			update(index: number) {
				let nodeBoundingRect = node.getBoundingClientRect();
				measurements.set(index, [nodeBoundingRect.top, nodeBoundingRect.bottom]);
			}
		};
	}
</script>

<div class="space-y-2 lg:w-3/5">
	<div class="bg-surface-50-900-token p-4 rounded-token">
		<input
			bind:value={$formStore.name}
			placeholder="Form Name"
			class="input variant-glass text-2xl"
		/>
	</div>
	<div use:formDropzone>
		<Accordion>
			{#each $formStore.fields as field, i (field.id)}
				{#if componentGhost.show && componentGhost.showAfterIndex === -1 && i === 0}
					<FormFieldGhost type={componentGhost.type} />
				{/if}

				<div use:measureTopBottomFields={i} class="bg-surface-50-900-token rounded-token">
					<FormField bind:field />
				</div>

				{#if componentGhost.show && componentGhost.showAfterIndex === i}
					<FormFieldGhost type={componentGhost.type} />
				{/if}
			{/each}
		</Accordion>
	</div>
</div>
