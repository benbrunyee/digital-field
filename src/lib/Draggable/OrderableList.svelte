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

	let ghostElement: {
		show: boolean;
		showAfterIndex: number | undefined;
	} = {
		show: false,
		showAfterIndex: undefined
	};

	/**
	 * Finds the next element to insert the dragged element after
	 * Returns the next element if there is one.
	 */
	function findNextElement(y: number) {
		const nextElement = allChildElements.reduce<{
			offset: number;
			nextElement: Element | undefined;
		}>(
			(acc, element, i, arr) => {
				// Since we don't unmount the component when dragging, we need to discount the index of the dragged element
				// Instead we just use the next element if there is one
				if (draggingExistingElement && i === hideElementIndex) {
					return acc;
				}

				const rect = element.getBoundingClientRect();
				const offset = y - rect.top - element.getBoundingClientRect().height / 2;

				if (offset < 0 && acc.offset > 0) {
					// TODO: Since we might be shifting the index by 1, we are actually getting the next element
					// This means that the last 2 elements are grouped together since we cannot get the second to last element
					return { offset, nextElement: arr[i] };
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
			showAfterIndex: nextElement ? allChildElements.indexOf(nextElement) - 1 : items.length - 1
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
		const nextElement = findNextElement(event.detail.position.y);

		let insertAfterIndex = items.length - 1;

		if (typeof nextElement !== 'undefined') {
			const indexOfNextElement = allChildElements.indexOf(nextElement);

			if (typeof hideElementIndex === 'undefined' || indexOfNextElement - 1 >= hideElementIndex) {
				// If we are dragging the element past its original position
				// Or if we are dragging an existing element past its original position
				// If we are dragging in a new element
				insertAfterIndex = indexOfNextElement - 1;
			} else {
				// Or if we are dragging an existing element to a position before its original position
				insertAfterIndex = indexOfNextElement;
			}
		}

		addItem(event.detail.payload, insertAfterIndex);

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

	<div bind:this={listContainer} class="space-y-1">
		{#each items as item, i}
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
