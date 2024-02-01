import type {
	DisplayFieldType,
	InputFieldType,
	NewDisplayField,
	NewInputField
} from '../../FormCreator/types/fieldTypes';
import { formatFieldType } from '../../SelectableElements/util/formatFieldType';
import { createId } from '../createId';

export function createDisplayFieldStructure<T extends DisplayFieldType>(type: T): NewDisplayField {
	return {
		clientId: createId(type),
		type,
		options: createDisplayFieldOptions(type)
	};
}

function createDisplayFieldOptions<T extends DisplayFieldType>(type: T): any {
	switch (type) {
		case 'heading':
			return {};
		case 'subheading':
			return {};
		case 'paragraph':
			return {};
		case 'separator':
			return {};
		default:
			return {};
	}
}

export function createInputFieldStructure<T extends InputFieldType>(
	type: T,
	name?: string
): NewInputField {
	return {
		clientId: createId(type),
		ref: type,
		description: '',
		name: name ?? formatFieldType(type),
		options: createInputFieldOptions(type),
		required: false,
		type
	};
}

function createInputFieldOptions<T extends InputFieldType>(type: T): any {
	switch (type) {
		case 'text':
			return {
				placeholder: ''
			};
		case 'number':
			return {};
		case 'date':
			return {};
		case 'time':
			return {};
		case 'audio':
			return {
				placeholder: ''
			};
		case 'address':
			return {
				placeholder: ''
			};
		case 'link':
			return {
				placeholder: ''
			};
		case 'multi-entry':
			return {};
		case 'choice':
			return {
				choiceOptions: {
					choice1: {
						label: 'Choice 1',
						value: 'choice1'
					},
					choice2: {
						label: 'Choice 2',
						value: 'choice2'
					}
				}
			};
		case 'multiple_choice':
			return {
				choiceOptions: {
					choice1: {
						label: 'Choice 1',
						value: 'choice1'
					},
					choice2: {
						label: 'Choice 2',
						value: 'choice2'
					}
				}
			};
		default:
			return {};
	}
}

export function createFieldRef(name: string): string {
	return name.toLocaleLowerCase().replace(/\s(.)?/, '$1'.toUpperCase());
}
