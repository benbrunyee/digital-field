<script lang="ts" context="module">
	type Payload<T extends any> = {
		payload: T;
	};
	type Position = {
		position: { x: number; y: number };
	};

	export type DraggedLeftZoneEventDetail<T extends any> = Payload<T>;
	export type DraggedEnteredZoneEventDetail<T extends any> = Payload<T> & Position;
	export type DraggedOverZoneEventDetail<T extends any> = Payload<T> & Position;
	export type DroppedInsideZoneEventDetail<T extends any> = Payload<T> & Position;
	export type DroppedOutsideZoneEventDetail<T extends any> = Payload<T> & Position;
</script>

<script lang="ts" generics="T extends any">
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import {
		draggedComponent,
		draggedComponentPayload,
		draggedComponentPosition,
		isDragging
	} from './stores/draggedSelectable';

	/**
	 * Events:
	 * - draggedEnteredZone - When the dragged component enters the dropzone
	 * - draggedOverZone - When the dragged component is over the dropzone
	 * - draggedLeftZone - When the dragged component leaves the dropzone
	 * - droppedInsideZone - When the dragged component is dropped inside the dropzone
	 * - droppedOutsideZone - When the dragged component is dropped outside the dropzone
	 */
	const dispatch = createEventDispatcher();

	let draggedOverZone = false;
	export let includeBottomBoundary = false;

	function dropzone(node: HTMLDivElement) {
		const nodeBoundingRect = node.getBoundingClientRect();

		function isDragInsideRectNoBottom(x: number, y: number) {
			// We don't check if the drop is below the form since this will just add
			// the element to the end of the form
			return x >= nodeBoundingRect.left && x <= nodeBoundingRect.right && y >= nodeBoundingRect.top;
		}

		function isDragInsideRect(x: number, y: number) {
			return isDragInsideRectNoBottom(x, y) && y <= nodeBoundingRect.bottom;
		}

		const isInBounds = includeBottomBoundary ? isDragInsideRect : isDragInsideRectNoBottom;

		const draggedMovedSubscriber = draggedComponentPosition.subscribe((position) => {
			if (!$isDragging) return;

			if (!position) return;

			const detail = {
				payload: $draggedComponentPayload
			};

			if (!isInBounds(position.x, position.y)) {
				draggedOverZone = false;
				dispatch('draggedLeftZone', <DraggedLeftZoneEventDetail<T>>detail);
				return;
			}

			if (!draggedOverZone) {
				draggedOverZone = true;
				dispatch('draggedEnteredZone', <DraggedEnteredZoneEventDetail<T>>{ ...detail, position });
			}

			dispatch('draggedOverZone', <DraggedOverZoneEventDetail<T>>{ ...detail, position });
		});

		const droppedSubscriber = isDragging.subscribe((dragging) => {
			// If we haven't picked up an element yet
			if (!$draggedComponent.hasPickedUp) return;

			const position = get(draggedComponentPosition);

			if (!dragging) {
				const detail = {
					payload: $draggedComponentPayload,
					position
				};

				if (position && isInBounds(position.x, position.y)) {
					dispatch('droppedInsideZone', <DroppedInsideZoneEventDetail<T>>detail);
				} else {
					dispatch('droppedOutsideZone', <DroppedOutsideZoneEventDetail<T>>detail);
				}
			}
		});

		return {
			destroy() {
				draggedMovedSubscriber();
				droppedSubscriber();
			}
		};
	}
</script>

<div {...$$restProps} class="relative {$$props.class ?? ''}" use:dropzone>
	<slot />
</div>
