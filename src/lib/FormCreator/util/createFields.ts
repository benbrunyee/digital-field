import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
import { createId } from '../../util/createId';
import type {
	DisplayField,
	DisplayFieldOptions,
	DisplayFieldType,
	InputField,
	InputFieldOptions,
	InputFieldType
} from '../types/fieldTypes';

export function createDisplayFieldStructure<T extends DisplayFieldType>(type: T): DisplayField<T> {
	return {
		id: createId(type),
		createdAt: new Date(),
		updatedAt: new Date(),
		type,
		options: createDisplayFieldOptions(type)
	};
}

function createDisplayFieldOptions<T extends DisplayFieldType>(type: T): DisplayFieldOptions<T> {
	switch (type) {
		case 'heading':
			return <DisplayFieldOptions<'heading'>>{};
		case 'subheading':
			return <DisplayFieldOptions<typeof type>>{};
		case 'paragraph':
			return <DisplayFieldOptions<typeof type>>{};
		case 'separator':
			return <DisplayFieldOptions<typeof type>>{};
		default:
			return <DisplayFieldOptions<typeof type>>{};
	}
}

export function createInputFieldStructure<T extends InputFieldType>(type: T): InputField<T> {
	return {
		id: createId(type),
		ref: type,
		createdAt: new Date(),
		updatedAt: new Date(),
		description: '',
		name: formatFieldType(type),
		options: createInputFieldOptions(type),
		required: false,
		type
	};
}

function createInputFieldOptions<T extends InputFieldType>(
	type: T
): InputFieldOptions<typeof type> {
	switch (type) {
		case 'text':
			return <InputFieldOptions<'text'>>{
				placeholder: ''
			};
		case 'number':
			return <InputFieldOptions<typeof type>>{};
		case 'date':
			return <InputFieldOptions<typeof type>>{};
		case 'time':
			return <InputFieldOptions<typeof type>>{};
		case 'audio':
			return <InputFieldOptions<typeof type>>{
				placeholder: ''
			};
		case 'address':
			return <InputFieldOptions<typeof type>>{
				placeholder: ''
			};
		case 'link':
			return <InputFieldOptions<typeof type>>{
				placeholder: ''
			};
		case 'multi-entry':
			return <InputFieldOptions<typeof type>>{
				placeholder: ''
			};
		default:
			return <InputFieldOptions<typeof type>>{};
	}
}

export function createFieldRef(name: string): string {
	return name.toLocaleLowerCase().replace(/\s(.)?/, '$1'.toUpperCase());
}
