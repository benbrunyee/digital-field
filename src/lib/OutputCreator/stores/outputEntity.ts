import { getContext, setContext } from 'svelte';
import { derived, writable } from 'svelte/store';
import { createId } from '../../util/createId';
import { createOutputEntityStructure } from '../../util/outputEntity/createOutputEntity';
import type { ExistingOutputEntity, NewOutputEntity } from '../types/outputEntityTypes';
import type {
	NewOutputDisplayField,
	NewOutputInputField,
	OutputFieldType
} from '../types/outputFieldTypes';
import {
	isExistingOutputDisplayField,
	isExistingOutputInputField,
	isNewOutputDisplayField,
	isOutputInputFieldType
} from '../util/isOutputFieldType';

let DEFAULT_STORE_NAME = 'outputEntityStore';

export const getOutputEntityStore = (storeName?: string) =>
	getContext<ReturnType<typeof outputEntityStore>>(storeName ?? DEFAULT_STORE_NAME);

export const initializeOutputEntityStores = (
	storeName?: string,
	initialValue?: NewOutputEntity | ExistingOutputEntity
) => {
	const store = outputEntityStore(initialValue ?? createOutputEntityStructure());
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const outputEntityStore = (initialValue: NewOutputEntity | ExistingOutputEntity) => {
	const store = writable<NewOutputEntity | ExistingOutputEntity>(initialValue);

	const addField = (type: OutputFieldType, atIndex?: number) => {
		let newField: NewOutputDisplayField | NewOutputInputField | undefined;

		if (isOutputInputFieldType(type)) {
			newField = {
				clientId: createId(type),
				fieldId: createId(type),
				type
			};
		} else {
			newField = {
				clientId: createId(type),
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
			outputEntity.fields = outputEntity.fields.filter((field) => {
				if (isExistingOutputDisplayField(field) || isExistingOutputInputField(field)) {
					return field.id !== id;
				} else if (isNewOutputDisplayField(field) || isNewOutputDisplayField(field)) {
					return field.clientId !== id;
				}

				return true;
			});
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
