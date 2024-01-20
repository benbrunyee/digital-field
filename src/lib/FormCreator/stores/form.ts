import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import type { FormFieldTypes, NewDisplayField, NewInputField } from '../types/fieldTypes';
import type { ExistingForm, NewForm } from '../types/formTypes';
import { createDisplayFieldStructure, createInputFieldStructure } from '../util/createFields';
import { createFormStructure } from '../util/createForm';
import {
	isDisplayFieldType,
	isExistingDisplayField,
	isExistingInputField,
	isInputField,
	isInputFieldType,
	isNewDisplayField,
	isNewInputField
} from '../util/isFieldType';

let DEFAULT_STORE_NAME = 'formStore';

export const getFormStore = (storeName?: string) => {
	const store = getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);
	return store ?? initializeFormStore();
};

export const initializeFormStore = (initialValue?: NewForm | ExistingForm, storeName?: string) => {
	const store = formStore(initialValue ?? createFormStructure());
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const formStore = (initialValue: NewForm | ExistingForm) => {
	const store = writable<NewForm | ExistingForm>(initialValue);

	const createNewForm = () => {
		store.update(() => createFormStructure());
	};

	const addField = (type: FormFieldTypes, insertAfter?: number) => {
		let newField: NewDisplayField | NewInputField;

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

			f.fields = f.fields.filter((field) => {
				if (isExistingDisplayField(field) || isExistingInputField(field)) {
					return field.id !== id;
				} else if (isNewDisplayField(field.type) || isNewInputField(field.type)) {
					return field.clientId !== id;
				}

				return true;
			});
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
	derived(store, ($form) => $form.fields.filter((f) => isInputField(f)));
