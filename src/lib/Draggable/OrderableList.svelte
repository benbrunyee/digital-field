<script lang="ts" generics="T extends object | number | boolean | string">
	import { createId } from '../util/createId';

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
	export let idField: T extends object ? keyof T : undefined = undefined;
	export let addItem: (item: any, insertAfter: number) => void;
	export let removeItem: (item?: any) => void;

	$: selectedIdField = idField ?? 'id';

	$: items.forEach((item) => {
		if (typeof item === 'object' && !item[selectedIdField]) {
			item[selectedIdField] = createId('orderable-list-item');
		}
	});

	let ghostElement = {
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

		if (
			nearestIndex === -1 &&
			nearestDistance <= ($measuredElements.get(0)[1] - $measuredElements.get(0)[0]) / 2
		)
			return -1;

		return nearestIndex;
	}

	function onDraggedOverZone(event: CustomEvent<DraggedOverZoneEventDetail>) {
		ghostElement = {
			show: true,
			showAfterIndex: findNextElementIndex(event.detail.position.y)
		};
	}

	function onDraggedLeftZone(event: CustomEvent<DraggedLeftZoneEventDetail>) {
		ghostElement = {
			show: false,
			showAfterIndex: undefined
		};

		if ('payload' in event.detail && event.detail.payload?.id) {
			removeItem(event.detail.payload);
		}
	}

	function onDropInsideZone(event: CustomEvent<DroppedInsideZoneEventDetail>) {
		addItem(
			{
				id: createId('orderable-list-item'),
				payload: event.detail.payload
			},
			ghostElement.showAfterIndex
		);

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
		{#each items as item, i (typeof item === 'object' && idField && item[selectedIdField] ? item[selectedIdField] : item)}
			{#if ghostElement.show && ghostElement.showAfterIndex === -1 && i === 0}
				<slot name="placeholderGhost" />
			{/if}

			<Draggable payload={item}>
				<MeasuredElement
					on:measure={(event) => {
						const detail = event.detail;
						$measuredElements.set(i, [detail.top, detail.bottom]);
					}}
				>
					<slot name="content" item={{ item, i }} />
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
