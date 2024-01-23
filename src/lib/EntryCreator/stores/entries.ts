import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ExistingEntry } from '../types/entryTypes';

const DEFAULT_STORE_NAME = 'entriesStore';

export const getEntriesStore = (storeName?: string) => {
	return getContext<ReturnType<typeof entriesStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeEntriesStore = (
	formId: string,
	initialValue: ExistingEntry[] = [],
	storeName?: string
) => {
	const store = entriesStore(formId, initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const entriesStore = (formId: string, initialValue?: ExistingEntry[]) => {
	const store = writable<ExistingEntry[]>(initialValue);

	const setFormId = (formId: string) => {
		// TODO: Get entry data
	};

	return {
		...store,
		setFormId
	};
};
