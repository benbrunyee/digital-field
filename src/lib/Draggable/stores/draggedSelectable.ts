import { derived, writable } from 'svelte/store';

export interface DraggableStore<T extends unknown> {
	position: {
		x: number;
		y: number;
	};
	dragging: boolean;
	hasPickedUp: boolean;
	payload: T | undefined;
}

const draggedComponentStore = <T extends unknown>() => {
	const store = writable<DraggableStore<T>>({
		hasPickedUp: false,
		dragging: false,
		payload: undefined,
		position: {
			x: 0,
			y: 0
		}
	});

	function stopDragging() {
		store.update((d) => {
			if (d) {
				d.dragging = false;
			}
			return d;
		});
	}

	function updateDraggedPosition(x: number, y: number) {
		store.update((d) => {
			if (d) {
				d.position.x = x;
				d.position.y = y;
				d.dragging = true;
				d.hasPickedUp = true;
			}
			return d;
		});
	}

	function setPayload(payload: T) {
		store.update((d) => {
			if (d) {
				d.payload = payload;
				d.hasPickedUp = true;
			}
			return d;
		});
	}

	return {
		subscribe: store.subscribe,
		stopDragging,
		updateDraggedPosition,
		setPayload
	};
};

export const draggedComponent = draggedComponentStore<unknown>();

export const isDragging = derived(draggedComponent, ($draggedComponent) => {
	return $draggedComponent.dragging;
});

export const draggedComponentPayload = derived(draggedComponent, ($draggedComponent) => {
	return $draggedComponent.payload;
});

export const draggedComponentPosition = derived(draggedComponent, ($draggedComponent) => {
	return $draggedComponent.position;
});
