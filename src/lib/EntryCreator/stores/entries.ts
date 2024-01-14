import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { EntryState } from '../../FormCreator/types/formTypes';
import type { Entry } from '../types/entryTypes';
import { createEntry } from '../util/createEntry';

const DEFAULT_STORE_NAME = 'entriesStore';

export const getEntriesStore = (storeName?: string) => {
	return getContext<ReturnType<typeof entriesStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeEntriesStore = <T extends EntryState>(
	formId: string,
	initialValue: Entry<T>[] = [],
	storeName?: string
) => {
	const store = entriesStore(formId, initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const entriesStore = <T extends EntryState>(formId: string, initialValue?: Entry<T>[]) => {
	const store = writable<Entry<T>[]>(initialValue);

	// TODO: Remove this
	const demoEntries: { [key: string]: Entry<T>[] } = {
		'1': [createEntry(formId)]
	};

	if (formId) {
		// TODO: Load form entries
		store.set(demoEntries[formId]);
	}

	const setFormId = (formId: string) => {
		// Get entry data
		const entries = demoEntries[formId];
		store.set(entries);
	};

	return {
		...store,
		setFormId
	};
};
