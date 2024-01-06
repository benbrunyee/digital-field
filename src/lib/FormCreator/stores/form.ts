import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import { createId } from '../../util/createId';
import { type FieldI } from '../types/fieldTypes';
import type { Form } from '../types/formTypes';
import { filterForInputField } from '../util/filterForFieldType';

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

	function addField(field: Omit<FieldI, 'id'>, atIndex?: number) {
		const newField: FieldI = {
			...field,
			id: createId(field.type)
		} as FieldI;

		if (atIndex && atIndex < 0) {
			atIndex = 0;
		}

		const fieldLength = get(store).fields.length;

		if (atIndex && atIndex > fieldLength) {
			atIndex = fieldLength;
		}

		store.update((f) => {
			if (atIndex !== undefined) {
				f.fields.splice(atIndex, 0, newField);
			} else {
				f.fields.push(newField);
			}

			return f;
		});

		return newField;
	}

	function removeField(id: string) {
		store.update((f) => {
			f.fields = f.fields.filter((field) => field.id !== id);
			return f;
		});
	}

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
