import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
import { createId } from '../../util/createId';
import type {
	DisplayFieldI,
	DisplayFieldType,
	InputFieldI,
	InputFieldType
} from '../types/fieldTypes';

export function createDisplayField<T extends DisplayFieldType>(type: T): DisplayFieldI<T> {
	return {
		id: createId(type),
		createdAt: new Date(),
		updatedAt: new Date(),
		type,
		options: undefined
	};
}

export function createInputField<T extends InputFieldType>(type: T): InputFieldI<T> {
	return {
		id: createId(type),
		createdAt: new Date(),
		updatedAt: new Date(),
		description: '',
		name: formatFieldType(type),
		options: undefined,
		placeholder: '',
		required: false,
		type,
		value: ''
	};
}
