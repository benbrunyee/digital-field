import { derived, get, writable } from 'svelte/store';
import { type FieldI } from '../types/fieldTypes';
import type { Form } from '../types/formTypes';

const formWritable = () => {
	const store = writable<Form>({
		id: '',
		name: 'Form Name',
		createdAt: new Date(),
		fields: [
			{
				id: Math.random().toString(36).substring(7),
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
				id: Math.random().toString(36).substring(7),
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
		const newField: FieldI = { ...field, id: Math.random().toString(36).substring(7) } as FieldI;

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

export const formStore = formWritable();
export const fieldsStore = derived(formStore, ($form) => $form.fields);
