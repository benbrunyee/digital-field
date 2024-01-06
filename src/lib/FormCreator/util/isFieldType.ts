import {
	displayFieldTypes,
	inputFieldTypes,
	type DisplayFieldI,
	type DisplayFieldType,
	type FieldI,
	type InputFieldI,
	type InputFieldType
} from '../types/fieldTypes';

export function isField(field: FieldI): field is FieldI {
	return isInputField(field) || isDisplayField(field);
}

export function isInputField(field: FieldI): field is InputFieldI<InputFieldType> {
	return inputFieldTypes.includes((field as InputFieldI<InputFieldType>).type);
}

export function isDisplayField(field: FieldI): field is DisplayFieldI<DisplayFieldType> {
	return displayFieldTypes.includes((field as DisplayFieldI<DisplayFieldType>).type);
}
