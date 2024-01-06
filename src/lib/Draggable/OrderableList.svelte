<script lang="ts" generics="T extends object | number | boolean | string">
	import { writable } from 'svelte/store';
	import Draggable from './Draggable.svelte';
	import Dropzone, {
		type DraggedLeftZoneEventDetail,
		type DraggedOverZoneEventDetail,
		type DroppedInsideZoneEventDetail
	} from './Dropzone.svelte';
	import MeasuredElement from './MeasuredElement.svelte';

	/**
	 * Slots:
	 * - placeholderGhost: The placeholder element that is shown when dragging an item within the list
	 * - draggedGhost: The ghost element that is shown when dragging an item
	 * - content: The content of each item
	 */

	export let items: T[];
	export let idField: keyof T | undefined = undefined;
	export let addItem: (item: unknown, insertAfter: number) => void;
	export let removeItem: (item?: unknown) => void;

	let hideElementIndex: number | undefined = undefined;

	let ghostElement: {
		show: boolean;
		showAfterIndex: number | undefined;
	} = {
		show: false,
		showAfterIndex: undefined
	};

	// Index: [top, bottom]
	const measuredElements = writable<Map<number, number[]>>(
		items.reduce((acc, item, index) => {
			acc.set(index, [0, 0]);
			return acc;
		}, new Map())
	);

	function findNextElementIndex(y: number) {
		if ($measuredElements.size === 0) return -1;

		let nearestIndex = -1;
		let nearestDistance = Infinity;

		$measuredElements.forEach(([top, bottom], index) => {
			const distance = Math.min(Math.abs(y - top), Math.abs(y - bottom));

			if (distance < nearestDistance) {
				nearestDistance = distance;

				if (distance <= (bottom - top) / 2) {
					nearestIndex = index - 1;
				} else {
					nearestIndex = index;
				}
			}
		});

		const firstElement = $measuredElements.get(0);

		if (
			firstElement &&
			nearestIndex === -1 &&
			nearestDistance <= (firstElement[1] - firstElement[0]) / 2
		)
			return -1;

		return nearestIndex;
	}

	function onDraggedOverZone(event: CustomEvent<DraggedOverZoneEventDetail<T>>) {
		ghostElement = {
			show: true,
			showAfterIndex: findNextElementIndex(event.detail.position.y)
		};
	}

	function onDraggedLeftZone(event: CustomEvent<DraggedLeftZoneEventDetail<T>>) {
		ghostElement = {
			show: false,
			showAfterIndex: undefined
		};

		removeItem(event.detail.payload);
	}

	function onDropInsideZone(event: CustomEvent<DroppedInsideZoneEventDetail<T>>) {
		addItem(event.detail.payload, ghostElement.showAfterIndex ?? 0);

		ghostElement = {
			show: false,
			showAfterIndex: undefined
		};
	}
</script>

<Dropzone
	on:droppedInsideZone={onDropInsideZone}
	on:draggedOverZone={onDraggedOverZone}
	on:draggedLeftZone={onDraggedLeftZone}
>
	<div class="space-y-1 {$$props.class ?? ''}">
		{#each items as item, i (typeof item === 'object' && idField && item[idField] ? item[idField] : item)}
			{#if ghostElement.show && ghostElement.showAfterIndex === -1 && i === 0}
				<slot name="placeholderGhost" />
			{/if}

			<Draggable
				payload={item}
				on:pickup={() => {
					hideElementIndex = i;
				}}
				on:drop={() => {
					hideElementIndex = undefined;
				}}
			>
				<MeasuredElement
					on:measure={(event) => {
						const detail = event.detail;
						$measuredElements.set(i, [detail.top, detail.bottom]);
					}}
				>
					{#if hideElementIndex !== i}
						<slot name="content" item={{ item, i }} />
					{/if}
				</MeasuredElement>

				<svelte:fragment slot="ghost">
					<slot name="draggedGhost" {item} />
				</svelte:fragment>
			</Draggable>

			{#if ghostElement.show && ghostElement.showAfterIndex === i}
				<slot name="placeholderGhost" />
			{/if}
		{/each}
	</div>
</Dropzone>
