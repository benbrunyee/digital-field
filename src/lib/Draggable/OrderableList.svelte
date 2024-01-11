<script lang="ts" generics="T extends object | number | boolean | string">
	import { fade } from 'svelte/transition';
	import Draggable from './Draggable.svelte';
	import Dropzone, {
		type DraggedLeftZoneEventDetail,
		type DraggedOverZoneEventDetail,
		type DroppedInsideZoneEventDetail,
		type DroppedOutsideZoneEventDetail
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
	let draggingExistingElement = false;
	let placeholderDummy: HTMLDivElement | undefined;

	let ghostElement: {
		show: boolean;
		showAfterIndex: number | undefined;
	} = {
		show: false,
		showAfterIndex: undefined
	};

	// Index: [top, bottom]
	let measuredElements = items.reduce((acc, item, index) => {
		acc.set(index, [0, 0]);
		return acc;
	}, new Map());

	function getItemId(item: T) {
		return typeof item === 'object' && idField && item[idField] ? item[idField] : item;
	}

	function findNextElementIndex(y: number) {
		if (measuredElements.size === 0) return -1;

		let nextElementIndex = -1;

		measuredElements.forEach(([top, bottom], index) => {
			if (y > (bottom - top) / 3 + top) {
				nextElementIndex = index;
			}
		});

		// Normalise the index
		if (nextElementIndex < -1) {
			nextElementIndex = -1;
		} else if (nextElementIndex >= items.length) {
			nextElementIndex = items.length - 1;
		}

		console.log(nextElementIndex);

		return nextElementIndex;
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
	}

	function onDropOutsideZone(event: CustomEvent<DroppedOutsideZoneEventDetail<T>>) {
		if (
			items.find(
				(item) =>
					(typeof item === 'object' && idField && item[idField] ? item[idField] : item) ===
					event.detail.payload
			)
		) {
			removeItem(event.detail.payload);
		}
	}

	function onDropInsideZone(event: CustomEvent<DroppedInsideZoneEventDetail<T>>) {
		addItem(event.detail.payload, ghostElement.showAfterIndex ?? -1);

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
	on:droppedOutsideZone={onDropOutsideZone}
>
	<div bind:this={placeholderDummy} class="invisible absolute">
		<slot name="placeholderGhost" />
	</div>

	<div
		class="space-y-1 {$$props.class ?? ''}"
		on:scroll={(e) => {
			console.log(e);
		}}
	>
		{#each items as item, i (getItemId(item))}
			{@const hideElement = hideElementIndex === i}

			<div
				class="relative transition-all"
				style:top="{ghostElement.show && (ghostElement.showAfterIndex ?? Infinity) < i
					? placeholderDummy?.clientHeight ?? 0
					: 0}px"
				in:fade
				out:fade
			>
				{#if ghostElement.show && ghostElement.showAfterIndex === i - 1}
					<div class="absolute -translate-y-full">
						<slot name="placeholderGhost" />
					</div>
				{/if}

				<Draggable
					threshold={20}
					payload={item}
					on:pickup={() => {
						hideElementIndex = i;
						draggingExistingElement = true;
					}}
					on:drop={() => {
						hideElementIndex = undefined;
						draggingExistingElement = false;
					}}
				>
					{#if !hideElement}
						<div class={ghostElement.show && i === 1 ? '!mt-0' : ''}>
							<MeasuredElement
								on:measure={(event) => {
									const detail = event.detail;
									measuredElements.set(i, [detail.top, detail.bottom]);
								}}
							>
								<slot name="content" item={{ item, i }} />
							</MeasuredElement>
						</div>
					{/if}

					<svelte:fragment slot="draggedGhost">
						<slot name="draggedGhost" {item} />
					</svelte:fragment>
				</Draggable>
			</div>
		{/each}

		{#if ghostElement.show && ghostElement.showAfterIndex === items.length - 1}
			<div class="absolute">
				<slot name="placeholderGhost" />
			</div>
		{/if}
	</div>
</Dropzone>
