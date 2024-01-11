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
	const ghostCoordinates = spring(
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

	function updateGhostCoordinates(x: number, y: number, hard?: boolean) {
		const newCoords = calculateGhostCoordinates(x, y);
		ghostCoordinates.update(
			(coords) => {
				coords.x = newCoords.x;
				coords.y = newCoords.y;
				return coords;
			},
			hard ? { hard: true } : undefined
		);
		return newCoords;
	}

	function calculateGhostCoordinates(x: number, y: number) {
		const { totalScrollLeft, totalScrollTop } = getScrollOffsets();

		return {
			x:
				x -
				lastClickedWithinElementPosition.x +
				selectableElement.offsetWidth / 2 -
				totalScrollLeft,
			y:
				y - lastClickedWithinElementPosition.y + selectableElement.offsetHeight / 2 - totalScrollTop
		};
	}

	function getScrollOffsets() {
		let totalScrollTop = 0;
		let totalScrollLeft = 0;
		let currentElement = selectableElement.parentElement;

		// Traverse up the DOM tree
		while (currentElement) {
			// Add the scroll offsets if the current element is scrollable
			totalScrollTop += currentElement.scrollTop || 0;
			totalScrollLeft += currentElement.scrollLeft || 0;

			// Move to the parent element
			currentElement = currentElement.parentElement;
		}

		return { totalScrollTop, totalScrollLeft };
	}

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

	function dropElement(x: number, y: number) {
		showGhost = false;

		// Update the store
		draggedComponent.stopDragging();

		dispatch('drop', {
			detail: {
				x,
				y
			}
		});
	}

	function onInnerMouseUp(e: MouseEvent) {
		mouseDown = false;
		dropElement(e.clientX, e.clientY);
	}

	function onInnerMouseDown(e: MouseEvent) {
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
		updateGhostCoordinates(e.clientX, e.clientY, true);

		// If threshold is greater than 0, then we don't want to start dragging yet
		// We handle the calculation in onInnerMouseMove
		if (threshold > 0) return;

		pickupElement(e.clientX, e.clientY);
	}

	function onInnerMouseMove(e: MouseEvent) {
		if (!mouseDown) return;

		// Update the coordinates of the ghost element
		updateGhostCoordinates(e.clientX, e.clientY, threshold > 0);

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

<div>
	<div bind:this={selectableElement} role="none" on:mousedown={onInnerMouseDown}>
		<slot />
	</div>

	{#if showGhost}
		<!-- -5px on height for the "pickup" effect -->
		<div
			class="absolute z-50 -translate-x-1/2 -translate-y-1/2 opacity-75"
			style:left="{$ghostCoordinates.x}px"
			style:top="{$ghostCoordinates.y - 5}px"
			style:width="{selectableElement.clientWidth}px"
			style:height="{selectableElement.clientHeight}px"
			role="none"
		>
			<slot name="draggedGhost" />
		</div>
	{/if}
</div>
