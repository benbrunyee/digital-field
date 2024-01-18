import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { type FormField, type FormFieldTypes } from '../types/fieldTypes';
import type { Form, UnsavedForm } from '../types/formTypes';
import { createDisplayFieldStructure, createInputFieldStructure } from '../util/createFields';
import { createFormStructure } from '../util/createForm';
import { filterForInputField } from '../util/filterForFieldType';
import { isDisplayFieldType, isInputFieldType } from '../util/isFieldType';

let DEFAULT_STORE_NAME = 'formStore';

export const getFormStore = (storeName?: string) => {
	const store = getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);
	return store ?? initializeFormStore();
};

export const initializeFormStore = (initialValue?: UnsavedForm | Form, storeName?: string) => {
	const store = formStore(initialValue ?? createFormStructure());
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const formStore = (initialValue: UnsavedForm | Form) => {
	const store = writable<UnsavedForm | Form>(initialValue);

	const createNewForm = () => {
		store.update(() => createFormStructure());
	};

	const addField = (type: FormFieldTypes, insertAfter?: number) => {
		let newField: FormField | undefined;

		if (isInputFieldType(type)) {
			newField = createInputFieldStructure(type);
		} else if (isDisplayFieldType(type)) {
			newField = createDisplayFieldStructure(type);
		} else {
			throw new Error('Invalid field type');
		}

		if ((insertAfter ?? -1) < -1) {
			insertAfter = 0;
		}

		const currentStore = get(store);
		const fieldLength = currentStore?.fields.length || 0;

		if ((insertAfter ?? Infinity) > fieldLength) {
			insertAfter = fieldLength;
		}

		store.update((f) => {
			if (!newField) {
				throw new Error('Invalid field type');
			}

			if (!f) {
				f = createFormStructure();
			}

			if (insertAfter !== undefined) {
				f.fields.splice(insertAfter + 1, 0, newField);
			} else {
				f.fields.push(newField);
			}

			return f;
		});

		return newField;
	};

	const removeField = (id: string) => {
		store.update((f) => {
			if (!f) {
				return f;
			}

			f.fields = f.fields.filter((field) => field.id !== id);
			return f;
		});
	};

	return {
		...store,
		createNewForm,
		addField,
		removeField
	};
};

export const fieldsStore = (store: ReturnType<typeof formStore>) =>
	derived(store, ($form) => $form.fields);

export const inputFieldsStore = (store: ReturnType<typeof formStore>) =>
	derived(store, ($form) => $form.fields.filter(filterForInputField));
