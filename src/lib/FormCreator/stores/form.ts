import { writable } from 'svelte/store';
import type { Field, FieldType } from '../types/fieldTypes';
import type { Form } from '../types/formTypes';

const formWritable = () => {
	const store = writable<Form>({
		name: 'Form Name',
		created: '',
		fields: [
			{
				id: Math.random().toString(36).substring(7),
				name: 'Date of Survey',
				type: 'date',
				options: [],
				required: false,
				value: ''
			}
		],
		id: '',
		last_updated: '',
		outputs: [],
		owner: ''
	});

	function addField(field: Omit<Field<FieldType>, 'id'>) {
		store.update((f) => {
			f.fields.push({ ...field, id: Math.random().toString(36).substring(7) });
			return f;
		});
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
