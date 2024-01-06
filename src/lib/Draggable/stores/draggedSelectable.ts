import { derived, writable } from 'svelte/store';

export interface DraggableStore<T extends any> {
	position: {
		x: number;
		y: number;
	};
	dragging: boolean;
	payload: T;
}

const draggedComponentStore = <T extends any>() => {
	const store = writable<DraggableStore<T>>({
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
			}
			return d;
		});
	}

	function setPayload(payload: T) {
		store.update((d) => {
			if (d) {
				d.payload = payload;
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

export const draggedComponent = draggedComponentStore<any>();

export const isDragging = derived(draggedComponent, ($draggedComponent) => {
	if ($draggedComponent) {
		return $draggedComponent.dragging;
	}
	return false;
});

export const draggedComponentPayload = derived(draggedComponent, ($draggedComponent) => {
	if ($draggedComponent) {
		return $draggedComponent.payload;
	}
	return undefined;
});

export const draggedComponentPosition = derived(draggedComponent, ($draggedComponent) => {
	if ($draggedComponent) {
		return $draggedComponent.position;
	}
	return undefined;
});
