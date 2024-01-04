<script lang="ts">
	import { spring } from 'svelte/motion';
	import { draggedComponent } from '../stores/draggedSelectable';
	import type { FieldTypes } from '../types/fieldTypes';

	import SelectableBase from './SelectableBase.svelte';

	export let type: FieldTypes;
	export let onMouseUp: (e: MouseEvent) => void = undefined;
	export let onMouseDown: (e: MouseEvent) => void = undefined;
	export let onMouseMove: (e: MouseEvent) => void = undefined;

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
		onMouseUp?.(e);
	}

	function onInnerMouseDown(e: MouseEvent) {
		mouseDown = true;
		draggedComponent.setDraggedNewField(type, e.clientX, e.clientY);
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
		onMouseDown?.(e);
	}

	function onInnerMouseMove(e: MouseEvent) {
		if (!mouseDown) return;

		coordinates.update((coords) => {
			coords.x = e.clientX;
			coords.y = e.clientY;
			return coords;
		});
		onMouseMove?.(e);
		draggedComponent.updateDraggedPosition(e.clientX, e.clientY);
	}
</script>

<svelte:window on:mousemove={onInnerMouseMove} on:mouseup={onInnerMouseUp} />

<div bind:this={selectableElement} role="none" on:mousedown={onInnerMouseDown}>
	<SelectableBase class="hover:!border-primary-500" {type} />
</div>

{#if mouseDown}
	<!-- Some reason, translating -1/2 on the y-axis doesn't center the element -->
	<div
		class="absolute z-50 -translate-x-1/2 -translate-y-2/3 opacity-75"
		style={`left: ${$coordinates.x}px; top: ${$coordinates.y}px; width: ${selectableElement.offsetWidth}px;`}
		role="none"
	>
		<SelectableBase
			class="border-dashed !border-primary-500 !text-primary-500"
			tooltip={false}
			{type}
		/>
	</div>
{/if}
