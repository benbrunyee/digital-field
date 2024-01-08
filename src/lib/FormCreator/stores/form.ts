import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { createId } from '../../util/createId';
import { type FieldI, type FieldType } from '../types/fieldTypes';
import type { Form } from '../types/formTypes';
import { createDisplayField, createInputField } from '../util/createFields';
import { filterForInputField } from '../util/filterForFieldType';
import { isDisplayFieldType, isInputFieldType } from '../util/isFieldType';

let DEFAULT_STORE_NAME = 'formStore';

export const getFormStore = (storeName?: string) =>
	getContext<ReturnType<typeof formStore>>(storeName ?? DEFAULT_STORE_NAME);

export const initializeFormStore = (storeName?: string) => {
	const store = formStore();
	setContext(storeName ?? DEFAULT_STORE_NAME, store);
	return store;
};

export const formStore = () => {
	const store = writable<Form>({
		id: '',
		name: 'Form Name',
		createdAt: new Date(),
		fields: [
			{
				id: createId('date'),
				name: 'Date of Survey',
				type: 'date',
				options: undefined,
				required: false,
				value: '',
				description: '',
				placeholder: '',
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: createId('text'),
				name: 'Surveyor Name',
				type: 'text',
				options: undefined,
				required: false,
				value: '',
				description: '',
				placeholder: '',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		],
		updatedAt: new Date(),
		outputs: [],
		owner: ''
	});

	const addField = (type: FieldType, insertAfter?: number) => {
		let newField: FieldI | undefined;

		if (isInputFieldType(type)) {
			newField = createInputField(type);
		} else if (isDisplayFieldType(type)) {
			newField = createDisplayField(type);
		} else {
			throw new Error('Invalid field type');
		}

		if (insertAfter && insertAfter < 0) {
			insertAfter = 0;
		}

		const fieldLength = get(store).fields.length;

		if (insertAfter && insertAfter > fieldLength) {
			insertAfter = fieldLength;
		}

		store.update((f) => {
			if (!newField) {
				throw new Error('Invalid field type');
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
			f.fields = f.fields.filter((field) => field.id !== id);
			return f;
		});
	};

	return {
		...store,
		addField,
		removeField
	};
};

export const fieldsStore = (store: ReturnType<typeof formStore>) =>
	derived(store, ($form) => $form.fields);

export const inputFieldsStore = (store: ReturnType<typeof formStore>) =>
	derived(store, ($form) => $form.fields.filter(filterForInputField));
