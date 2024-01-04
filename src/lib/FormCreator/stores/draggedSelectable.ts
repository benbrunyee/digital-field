import { derived, writable } from 'svelte/store';
import type { FieldI, FieldTypes } from '../types/fieldTypes';

type DraggedElementBase = {
	dragging: boolean;
	x: number;
	y: number;
};

type DraggedExistingElement = {
	new: false;
	field: FieldI;
} & DraggedElementBase;

type DraggedNewElement = {
	new: true;
	dragging: boolean;
	fieldType: FieldTypes;
} & DraggedElementBase;

const draggedComponentStore = () => {
	const store = writable<DraggedExistingElement | DraggedNewElement | undefined>(undefined);

	function setDraggedExistingField(field: FieldI, x: number, y: number) {
		store.set({
			new: false,
			dragging: true,
			x,
			y,
			field
		});
	}

	function setDraggedNewField(fieldType: FieldTypes, x: number, y: number) {
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

export const draggedComponent = draggedComponentStore();
export const draggedCoordinates = derived(draggedComponent, ($draggedComponent) => {
	if ($draggedComponent) {
		return {
			x: $draggedComponent.x,
			y: $draggedComponent.y
		};
	}
	return undefined;
});
export const isDragging = derived(draggedComponent, ($draggedComponent) => {
	if ($draggedComponent) {
		return $draggedComponent.dragging;
	}
	return false;
});
