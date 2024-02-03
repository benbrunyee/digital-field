<script lang="ts" generics="T extends object | number | boolean | string">
	import { fade } from 'svelte/transition';
	import Draggable from './Draggable.svelte';
	import Dropzone, {
		type DraggedLeftZoneEventDetail,
		type DraggedOverZoneEventDetail,
		type DroppedInsideZoneEventDetail,
		type DroppedOutsideZoneEventDetail
	} from './Dropzone.svelte';

	/**
	 * Slots:
	 * - placeholderGhost: The placeholder element that is shown when dragging an item within the list
	 * - draggedGhost: The ghost element that is shown when dragging an item
	 * - content: The content of each item
	 */

	export let items: T[];
	export let addItem: (item: unknown, insertAfter: number) => void;
	export let removeItem: (item?: unknown) => void;
	export let keyGenerator: (item: T) => string | number;

	let hideElementIndex: number | undefined = undefined;
	let draggingExistingElement = false;
	let placeholderDummy: HTMLDivElement | undefined;
	let listContainer: HTMLDivElement | undefined;

	$: allChildElements = listContainer?.children ? Array.from(listContainer.children) : [];
	$: childElementsWithoutDragged = Array.from(allChildElements).filter(
		(element, i) => i !== hideElementIndex
	);

	let ghostElement: {
		show: boolean;
		showAfterIndex: number | undefined;
	} = {
		show: false,
		showAfterIndex: undefined
	};

	function findNextElement(y: number) {
		const nextElement = childElementsWithoutDragged.reduce<{
			offset: number;
			nextElement: Element | undefined;
		}>(
			(acc, element, i, arr) => {
				// Since we don't unmount the element when dragging, we need to consider the shift in the index
				const indexShift = hideElementIndex !== undefined && hideElementIndex <= i ? 1 : 0;

				const rect = element.getBoundingClientRect();
				const offset = y - rect.top - element.getBoundingClientRect().height / 2;

				if (offset < 0 && acc.offset > 0) {
					return { offset, nextElement: arr[i + indexShift] };
				}

				return acc;
			},
			{ offset: Number.POSITIVE_INFINITY, nextElement: undefined }
		);

		return nextElement.nextElement;
	}

	function onDraggedOverZone(event: CustomEvent<DraggedOverZoneEventDetail<T>>) {
		const nextElement = findNextElement(event.detail.position.y);

		ghostElement = {
			show: true,
			showAfterIndex: nextElement
				? childElementsWithoutDragged.indexOf(nextElement) - 1
				: items.length - 1
		};
	}

	function onDraggedLeftZone(event: CustomEvent<DraggedLeftZoneEventDetail<T>>) {
		ghostElement = {
			show: false,
			showAfterIndex: undefined
		};
	}

	function onDropOutsideZone(event: CustomEvent<DroppedOutsideZoneEventDetail<T>>) {
		if (items.find((item) => item === event.detail.payload)) {
			removeItem(event.detail.payload);
		}
	}

	function onDropInsideZone(event: CustomEvent<DroppedInsideZoneEventDetail<T>>) {
		// Since we don't unmount the element when dragging, we need to consider the shift in the index
		const indexShift =
			hideElementIndex !== undefined &&
			ghostElement.showAfterIndex &&
			hideElementIndex > ghostElement.showAfterIndex
				? 1
				: 0;

		addItem(
			event.detail.payload,
			ghostElement.showAfterIndex ? ghostElement.showAfterIndex + indexShift : -1
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
	on:droppedOutsideZone={onDropOutsideZone}
>
	<div bind:this={placeholderDummy} class="invisible absolute w-full">
		<slot name="placeholderGhost" />
	</div>

	<div
		bind:this={listContainer}
		class="space-y-1"
		on:scroll={(e) => {
			console.log(e);
		}}
	>
		{#each items as item, i (keyGenerator(item))}
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
					<div class="absolute w-full -translate-y-full">
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
							<slot name="content" item={{ item, i }} />
						</div>
					{/if}

					<svelte:fragment slot="draggedGhost">
						<slot name="draggedGhost" {item} />
					</svelte:fragment>
				</Draggable>
			</div>
		{/each}

		{#if ghostElement.show && ghostElement.showAfterIndex === items.length - 1}
			<div class="absolute w-full">
				<slot name="placeholderGhost" />
			</div>
		{/if}
	</div>
</Dropzone>
