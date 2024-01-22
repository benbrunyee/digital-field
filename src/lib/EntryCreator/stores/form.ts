import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ExistingForm } from '../../FormCreator/types/formTypes';

let DEFAULT_STORE_NAME = 'recordFormStore';

export const getFormStore = (storeName?: string) => {
	return getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeFormStore = (initialValue?: ExistingForm, storeName?: string) => {
	const store = formStore(initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const formStore = (initialValue?: ExistingForm) => {
	const store = writable<ExistingForm | undefined>(initialValue);

	const setFormId = (id: string) => {
		// TODO: Get form data
	};

	return {
		...store,
		setFormId
	};
};
