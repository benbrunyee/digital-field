import {
	displayFieldTypes,
	inputFieldTypes,
	type DisplayFieldI,
	type DisplayFieldType,
	type Field,
	type InputFieldI,
	type InputFieldType
} from '../types/fieldTypes';

export function isInputField(field: Field): field is InputFieldI<InputFieldType> {
	return inputFieldTypes.includes((field as InputFieldI<InputFieldType>).type);
}

export function isDisplayField(field: Field): field is DisplayFieldI<DisplayFieldType> {
	return displayFieldTypes.includes((field as DisplayFieldI<DisplayFieldType>).type);
}
