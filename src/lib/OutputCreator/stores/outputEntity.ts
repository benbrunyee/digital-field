import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createId } from '../../util/createId';
import type { WithId } from '../../util/types/withId';
import type { OutputEntityWithFieldIds } from '../types/outputEntityTypes';
import type { OutputField, OutputFieldType } from '../types/outputFieldTypes';
import { isOutputInputFieldType } from '../util/isOutputFieldType';

let DEFAULT_STORE_NAME = 'outputEntityStore';

export const getOutputEntityStore = (storeName?: string) =>
	getContext<ReturnType<typeof outputEntityStore>>(storeName ?? DEFAULT_STORE_NAME);

export const initializeOutputEntityStores = (
	storeName?: string,
	initialValue?: OutputEntityWithFieldIds
) => {
	const store = outputEntityStore(initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const outputEntityStore = (initialValue?: OutputEntityWithFieldIds) => {
	const store = writable<OutputEntityWithFieldIds>(
		initialValue ?? {
			id: '1',
			formId: '',
			isCustom: false,
			overrides: [],
			template: {
				id: '1',
				fieldTemplates: [],
				options: {},
				tailPage: undefined,
				topPage: undefined,
				type: 'pdf'
			},
			name: 'Test Output Entity',
			fields: [],
			ownerId: '',
			state: 'draft',
			updatedAt: undefined,
			createdAt: undefined
		}
	);

	const addField = (type: OutputFieldType, atIndex?: number) => {
		let newField: WithId<OutputField> | undefined = undefined;

		if (isOutputInputFieldType(type)) {
			newField = {
				id: createId(type),
				fieldId: createId(type),
				type
			};
		} else {
			newField = {
				id: createId(type),
				type
			};
		}

		store.update((outputEntity) => {
			if (!newField) {
				throw new Error('Failed to create new field');
			}

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
