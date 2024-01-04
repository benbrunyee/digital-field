<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import FormField from './FormFields/FormField.svelte';
	import { draggedComponent, draggedCoordinates, isDragging } from './stores/draggedSelectable';
	import { formStore } from './stores/form';
	import { inputFieldTypes, type InputFieldI, type InputFieldType } from './types/fieldTypes';
	import { formatFieldType } from './util/formatFieldType';

	$: console.log($formStore);

	function formDropzone(node: HTMLDivElement) {
		let droppedSubscriber = isDragging.subscribe((value) => {
			if (!value && node && $draggedCoordinates) {
				const { x, y } = $draggedCoordinates;

				// Check if the coordinated are inside the form element
				if (
					x > node.offsetLeft &&
					x < node.offsetLeft + node.offsetWidth &&
					y > node.offsetTop
					// We don't check if the drop is below the form since this will just add
					// the element to the end of the form
				) {
					console.log('Mouse is inside the form element');
					// TODO: Add the element to the form

					if (!$draggedComponent) return;

					if ($draggedComponent.new) {
						// Add a new field
						formStore.addField({
							type: $draggedComponent.fieldType,
							options: undefined,
							...(inputFieldTypes.includes($draggedComponent.fieldType as InputFieldType) &&
								({
									name: `${formatFieldType($draggedComponent.fieldType)} Field`
								} as InputFieldI<InputFieldType>))
						});

						// We clear the dragged component so that it doesn't get added again if the
						// state changes unexpectedly
						draggedComponent.clearDragged();
					} else {
						// Move an existing field
					}
				}
			}
		});

		let onMouseMoveSubsriber = draggedCoordinates.subscribe((coordinates) => {
			if (!coordinates) return;

			// TODO: Add a placeholder into the form where the element will be dropped
		});

		return {
			destroy() {
				droppedSubscriber?.();
				onMouseMoveSubsriber?.();
			}
		};
	}
</script>

<div class="space-y-4 lg:w-3/5">
	<div class="bg-surface-50-900-token p-4 rounded-token">
		<input
			bind:value={$formStore.name}
			placeholder="Form Name"
			class="input variant-glass text-2xl"
		/>
	</div>
	<div use:formDropzone class="space-y-4">
		<Accordion autocollapse>
			{#each $formStore.fields as field}
				<div class="bg-surface-50-900-token p-4 rounded-token">
					<FormField bind:field />
				</div>
			{/each}
		</Accordion>
	</div>
</div>
