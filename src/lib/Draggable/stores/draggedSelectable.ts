import { setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { AllFieldTypes, AllFieldsI } from '../../SelectableElements/types/fieldTypes';

type DraggedElementBase = {
	dragging: boolean;
	x: number;
	y: number;
};

type DraggedExistingElement<F extends AllFieldsI> = {
	new: false;
	field: F;
} & DraggedElementBase;

type DraggedNewElement<T extends AllFieldTypes> = {
	new: true;
	dragging: boolean;
	fieldType: T;
} & DraggedElementBase;

export const initializeDraggedComponentStore = <
	T extends AllFieldsI,
	F extends AllFieldTypes
>() => {
	const store = draggedComponentStore<T, F>();
	setContext('draggedComponentStore', store);
	return store;
};

export const draggedComponentStore = <F extends AllFieldsI, T extends AllFieldTypes>() => {
	const store = writable<DraggedExistingElement<F> | DraggedNewElement<T> | undefined>(undefined);

	function setDraggedExistingField(field: F, x: number, y: number) {
		store.set({
			new: false,
			dragging: true,
			x,
			y,
			field
		});
	}

	function setDraggedNewField(fieldType: T, x: number, y: number) {
		store.set({
			new: true,
			dragging: true,
			x,
			y,
			fieldType
		});
	}

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
				d.x = x;
				d.y = y;
			}
			return d;
		});
	}

	function clearDragged() {
		store.set(undefined);
	}

	return {
		subscribe: store.subscribe,
		setDraggedExistingField,
		setDraggedNewField,
		stopDragging,
		updateDraggedPosition,
		clearDragged
	};
};

export const draggedCoordinatesStore = (store: ReturnType<typeof draggedComponentStore>) =>
	derived(store, ($draggedComponent) => {
		if ($draggedComponent) {
			return {
				x: $draggedComponent.x,
				y: $draggedComponent.y
			};
		}
		return undefined;
	});

export const isDraggingStore = (store: ReturnType<typeof draggedComponentStore>) =>
	derived(store, ($draggedComponent) => {
		if ($draggedComponent) {
			return $draggedComponent.dragging;
		}
		return false;
	});
