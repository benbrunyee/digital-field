import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { ExistingForm } from '../../FormCreator/types/formTypes';
import { loadForm } from '../../util/form/loadForms';

let DEFAULT_STORE_NAME = 'entryFormStore';

export const getFormStore = (storeName?: string) => {
	const store = getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);
	return store ?? initializeFormStore(undefined, storeName ?? DEFAULT_STORE_NAME);
};

export const initializeFormStore = (initialValue?: ExistingForm, storeName?: string) => {
	const store = formStore(initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const formStore = (initialValue?: ExistingForm) => {
	const store = writable<ExistingForm | undefined>(initialValue);

	const setFormId = async (id: string) => {
		const form = await loadForm(id);
		console.log(form);
		store.set(form);
		return form;
	};

	return {
		...store,
		setFormId
	};
};
