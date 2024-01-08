<script lang="ts" generics="T extends object | number | boolean | string">
	import { createEventDispatcher } from 'svelte';

	import { spring } from 'svelte/motion';
	import { draggedComponent } from './stores/draggedSelectable';

	/**
	 * The payload that will be passed to the dragged component
	 */
	export let payload: T;

	/**
	 * The distance the user must drag the element before it is considered a drag
	 */
	export let threshold = 0;

	/**
	 * Events:
	 * - pickup: Fired when the user picks up the element
	 * - drag: Fired when the user is dragging the element
	 * - drop: Fired when the user drops the element
	 */
	const dispatch = createEventDispatcher();

	type Position = {
		x: number;
		y: number;
	};

	let mouseDown = false;
	let showGhost = false;
	let lastClickedWithinElementPosition: Position = { x: 0, y: 0 };
	let lastClickedOnScreenPosition: Position = { x: 0, y: 0 };
	const coordinates = spring(
		{
			x: 0,
			y: 0
		},
		{
			stiffness: 0.125,
			damping: 0.5
		}
	);
	let selectableElement: HTMLDivElement;

	function pickupElement(x: number, y: number) {
		showGhost = true;

		// Update the store
		draggedComponent.setPayload(payload);
		draggedComponent.updateDraggedPosition(x, y);

		dispatch('pickup', {
			detail: {
				x,
				y
			}
		});
	}

	function onInnerMouseUp(e: MouseEvent) {
		e.preventDefault();

		mouseDown = false;
		showGhost = false;

		// Update the store
		draggedComponent.stopDragging();

		dispatch('drop', {
			detail: {
				x: e.clientX,
				y: e.clientY
			}
		});
	}

	function onInnerMouseDown(e: MouseEvent) {
		e.preventDefault();

		mouseDown = true;

		// Set the position on the screen that was clicked
		lastClickedOnScreenPosition = {
			x: e.clientX,
			y: e.clientY
		};

		// Set the position within the element that was clicked
		lastClickedWithinElementPosition = {
			x: e.clientX - selectableElement.offsetLeft,
			y: e.clientY - selectableElement.offsetTop
		};

		// Update the coordinates of the ghost element
		coordinates.update(
			(coords) => {
				// Offset by the inverse of the clicked position so that the elemnt doesn't jump
				coords.x =
					e.clientX - lastClickedWithinElementPosition.x + selectableElement.offsetWidth / 2;
				coords.y =
					e.clientY - lastClickedWithinElementPosition.y + selectableElement.offsetHeight / 2;
				return coords;
			},
			{
				hard: true
			}
		);

		// If threshold is greater than 0, then we don't want to start dragging yet
		// We handle the calculation in onInnerMouseMove
		if (threshold > 0) return;

		pickupElement(e.clientX, e.clientY);
	}

	function onInnerMouseMove(e: MouseEvent) {
		e.preventDefault();

		if (!mouseDown) return;

		// Update the coordinates of the ghost element
		coordinates.update(
			(coords) => {
				coords.x =
					e.clientX - lastClickedWithinElementPosition.x + selectableElement.offsetWidth / 2;
				coords.y =
					e.clientY - lastClickedWithinElementPosition.y + selectableElement.offsetHeight / 2;
				return coords;
			},
			threshold > 0 ? { hard: true } : undefined
		);

		// If threshold is greater than 0, then we don't want to start dragging yet
		if (threshold > 0 && !showGhost) {
			// Calculate the distance between the last clicked position and the current mouse position
			const distance = Math.sqrt(
				Math.pow(e.clientX - lastClickedOnScreenPosition.x, 2) +
					Math.pow(e.clientY - lastClickedOnScreenPosition.y, 2)
			);

			// If the distance is less than the threshold, then we don't want to start dragging yet
			if (distance < threshold) return;

			// Otherwise, we can start dragging
			pickupElement(e.clientX, e.clientY);
		}

		// Update the store
		draggedComponent.updateDraggedPosition(e.clientX, e.clientY);

		dispatch('drag', {
			detail: {
				x: e.clientX,
				y: e.clientY
			}
		});
	}
</script>

<svelte:window on:mousemove={onInnerMouseMove} on:mouseup={onInnerMouseUp} />

<div bind:this={selectableElement} role="none" on:mousedown={onInnerMouseDown}>
	<slot />
</div>

{#if showGhost}
	<!-- Some reason, translating -1/2 on the y-axis doesn't center the element -->
	<div
		class="absolute z-50 -translate-x-1/2 -translate-y-2/3 opacity-75"
		style={`left: ${$coordinates.x}px; top: ${$coordinates.y}px; width: ${selectableElement.offsetWidth}px; height: ${selectableElement.offsetHeight}px;`}
		role="none"
	>
		<slot name="ghost" />
	</div>
{/if}
