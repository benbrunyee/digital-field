<script lang="ts" generics="T extends object | number | boolean | string">
	import { spring } from 'svelte/motion';
	import { draggedComponent } from './stores/draggedSelectable';

	export let payload: T;

	let mouseDown = false;
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
	}

	function onInnerMouseDown(e: MouseEvent) {
		mouseDown = true;
		draggedComponent.setPayload(payload);
		draggedComponent.updateDraggedPosition(e.clientX, e.clientY);
		coordinates.update(
			(coords) => {
				coords.x = e.clientX;
				coords.y = e.clientY;
				return coords;
			},
			{
				hard: true
			}
		);
	}

	function onInnerMouseMove(e: MouseEvent) {
		if (!mouseDown) return;

		coordinates.update((coords) => {
			coords.x = e.clientX;
			coords.y = e.clientY;
			return coords;
		});
		draggedComponent.updateDraggedPosition(e.clientX, e.clientY);
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
		style={`left: ${$coordinates.x}px; top: ${$coordinates.y}px; width: ${selectableElement.offsetWidth}px;`}
		role="none"
	>
		<slot name="ghost" />
	</div>
{/if}
