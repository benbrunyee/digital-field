import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { EntryState } from '../../FormCreator/types/formTypes';
import { createId } from '../../util/createId';
import type { Entry } from '../types/entryTypes';
import { createEntry } from '../util/createEntry';

const DEFAULT_STORE_NAME = 'entryStore';

export const getEntryStore = (storeName?: string) => {
	return getContext<ReturnType<typeof entryStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeEntryStore = <T extends EntryState>(
	formId: string,
	initialValue?: Entry<T>,
	storeName?: string
) => {
	const store = entryStore(formId, initialValue ?? createEntry(formId));
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const entryStore = <T extends EntryState>(formId: string, initialValue?: Entry<T>) => {
	const store = writable<Entry<T>>(initialValue);

	// TODO: Remove this
	const demoEntry: { [key: string]: Entry<T> } = {
		'1': createEntry(formId)
	};

	const setEntryId = (id: string) => {
		// Get entry data
		const entry = demoEntry[id];
		store.set(entry);
	};

	const setFieldValue = (fieldId: string, value: any) => {
		// TODO: Make this more efficient by using a map then convert it into an array
		store.update((current) => {
			if (current.fields.find((field) => field.id === fieldId)) {
				return {
					...current,
					fields: current.fields.map((field) => {
						if (field.id === fieldId) {
							return {
								...field,
								value
							};
						}
						return field;
					})
				};
			} else {
				current.fields.push({
					id: createId('entry'),
					value,
					fieldId
				});
			}

			return current;
		});
	};

	return {
		...store,
		setEntryId,
		setFieldValue
	};
};
