<script lang="ts">
	import { spring } from 'svelte/motion';
	import type { FieldType, displayElementTypes } from '../types/fieldTypes';

	import SelectableBase from './SelectableBase.svelte';

	export let type: FieldType | (typeof displayElementTypes)[number];
	export let onMouseUp: (e: MouseEvent) => void = () => {};
	export let onMouseDown: (e: MouseEvent) => void = () => {};
	export let onMouseMove: (e: MouseEvent) => void = () => {};

	let mouseDown = false;
	const coordinates = spring(
		{
			x: 0,
			y: 0
		},
		{
			stiffness: 0.1,
			damping: 0.5
		}
	);
	let selectableElement: HTMLDivElement;

	function onInnerMouseUp(e: MouseEvent) {
		mouseDown = false;
		onMouseUp?.(e);
	}

	function onInnerMouseDown(e: MouseEvent) {
		mouseDown = true;
		coordinates.update((coords) => {
			coords.x = e.clientX;
			coords.y = e.clientY;
			return coords;
		});
		onMouseDown?.(e);
	}

	function onInnerMouseMove(e: MouseEvent) {
		coordinates.update((coords) => {
			coords.x = e.clientX;
			coords.y = e.clientY;
			return coords;
		});
		onMouseMove?.(e);
	}
</script>

<svelte:window on:mousemove={onInnerMouseMove} on:mouseup={onInnerMouseUp} />

<div bind:this={selectableElement} role="none" on:mousedown={onInnerMouseDown}>
	<SelectableBase class="hover:!border-primary-500" {type} />
</div>

{#if mouseDown}
	<div
		class="absolute z-50 -translate-x-1/2 -translate-y-1/2 opacity-75"
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
