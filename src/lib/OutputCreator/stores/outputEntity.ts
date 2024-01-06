import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createId } from '../../util/createId';
import type { OutputEntityI } from '../types/outputEntityTypes';
import type { OutputFieldI, OutputFieldType } from '../types/outputFieldTypes';

let DEFAULT_STORE_NAME = 'outputEntityStore';

export const getOutputEntityStore = (storeName?: string) =>
	getContext<ReturnType<typeof outputEntityStore>>(storeName ?? DEFAULT_STORE_NAME);

export const initializeOutputEntityStores = (storeName: string, initialValue?: OutputEntityI) => {
	const store = outputEntityStore(initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const outputEntityStore = (initialValue?: OutputEntityI) => {
	const store = writable<OutputEntityI>(
		initialValue ?? {
			id: '1',
			name: 'Test Output Entity',
			fields: [],
			owner: '',
			state: 'draft',
			type: 'pdf',
			updatedAt: undefined,
			createdAt: undefined
		}
	);

	const addField = (type: OutputFieldType, atIndex?: number) => {
		// TODO: Create a new field
		const newField: OutputFieldI = {
			type,
			id: createId(type)
		} as OutputFieldI;

		store.update((outputEntity) => {
			if (atIndex) {
				outputEntity.fields.splice(atIndex, 0, newField);
			} else {
				outputEntity.fields.push(newField);
			}

			return outputEntity;
		});
	};

	const removeField = (id: string) => {
		store.update((outputEntity) => {
			outputEntity.fields = outputEntity.fields.filter((field) => field.id !== id);
			return outputEntity;
		});
	};

	return {
		...store,
		addField,
		removeField
	};
};

export const outputEntityFieldsStore = (store: ReturnType<typeof outputEntityStore>) =>
	derived(store, ($outputEntity) => $outputEntity.fields);
