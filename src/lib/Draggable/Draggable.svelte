<script lang="ts" generics="T extends object | number | boolean | string">
	import { createEventDispatcher } from 'svelte';

	import { spring } from 'svelte/motion';
	import { draggedComponent } from './stores/draggedSelectable';

	export let payload: T;

	/**
	 * Events:
	 * - pickup: Fired when the user picks up the element
	 * - drag: Fired when the user is dragging the element
	 * - drop: Fired when the user drops the element
	 */
	const dispatch = createEventDispatcher();

	let mouseDown = false;
	let lastClickedWithinElementPosition: { x: number; y: number } = { x: 0, y: 0 };
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

	function onInnerMouseUp(e: MouseEvent) {
		mouseDown = false;
		draggedComponent.stopDragging();
		dispatch('drop', {
			detail: {
				x: e.clientX,
				y: e.clientY
			}
		});
	}

	function onInnerMouseDown(e: MouseEvent) {
		mouseDown = true;
		draggedComponent.setPayload(payload);
		draggedComponent.updateDraggedPosition(e.clientX, e.clientY);

		// Set the position within the element that was clicked
		lastClickedWithinElementPosition = {
			x: e.clientX - selectableElement.offsetLeft,
			y: e.clientY - selectableElement.offsetTop
		};

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
		dispatch('pickup', {
			detail: {
				x: e.clientX,
				y: e.clientY
			}
		});
	}

	function onInnerMouseMove(e: MouseEvent) {
		if (!mouseDown) return;

		coordinates.update((coords) => {
			coords.x = e.clientX - lastClickedWithinElementPosition.x + selectableElement.offsetWidth / 2;
			coords.y =
				e.clientY - lastClickedWithinElementPosition.y + selectableElement.offsetHeight / 2;
			return coords;
		});
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

{#if mouseDown}
	<!-- Some reason, translating -1/2 on the y-axis doesn't center the element -->
	<div
		class="absolute z-50 -translate-x-1/2 -translate-y-2/3 opacity-75"
		style={`left: ${$coordinates.x}px; top: ${$coordinates.y}px; width: ${selectableElement.offsetWidth}px; height: ${selectableElement.offsetHeight}px;`}
		role="none"
	>
		<slot name="ghost" />
	</div>
{/if}
