import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Form, UnsavedForm } from '../../FormCreator/types/formTypes';
import { createFormStructure } from '../../FormCreator/util/createForm';

let DEFAULT_STORE_NAME = 'recordFormStore';

export const getFormStore = (storeName?: string) => {
	return getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);
};

export const initializeFormStore = (initialValue?: UnsavedForm, storeName?: string) => {
	const store = formStore(initialValue);
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

const formStore = (initialValue?: UnsavedForm) => {
	const store = writable<UnsavedForm | undefined>(initialValue);

	const setFormId = (id: string) => {
		// Get form data
		const form = demoForm[id];
		store.set(form);
	};

	return {
		...store,
		setFormId
	};
};

// TODO: Remove this
const demoForm: { [key: string]: Form } = {
	'1': {
		id: '1',
		...createFormStructure()
	} as Form
};
