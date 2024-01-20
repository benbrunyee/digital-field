import {
	allFormFieldTypes,
	displayFieldSchema,
	existingDisplayFieldSchema,
	existingInputFieldSchema,
	formFieldSchema,
	inputFieldSchema,
	newDisplayFieldSchema,
	newInputFieldSchema,
	type DisplayField,
	type DisplayFieldType,
	type ExistingDisplayField,
	type ExistingInputField,
	type FormField,
	type InputField,
	type InputFieldType,
	type NewDisplayField,
	type NewInputField
} from '../types/fieldTypes';

export function isField(field: unknown): field is FormField {
	return formFieldSchema.safeParse(field).success;
}

// Input field

export function isInputField(field: unknown): field is InputField {
	return inputFieldSchema.safeParse(field).success;
}

export function isExistingInputField(field: unknown): field is ExistingInputField {
	return existingInputFieldSchema.safeParse(field).success;
}

export function isNewInputField(field: unknown): field is NewInputField {
	return newInputFieldSchema.safeParse(field).success;
}

export function isInputFieldType(type: unknown): type is InputFieldType {
	return allFormFieldTypes.includes(type as InputFieldType);
}

// Display field

export function isDisplayField(field: unknown): field is DisplayField {
	return displayFieldSchema.safeParse(field).success;
}

export function isExistingDisplayField(field: unknown): field is ExistingDisplayField {
	return existingDisplayFieldSchema.safeParse(field).success;
}

export function isNewDisplayField(field: unknown): field is NewDisplayField {
	return newDisplayFieldSchema.safeParse(field).success;
}

export function isDisplayFieldType(type: unknown): type is DisplayFieldType {
	return allFormFieldTypes.includes(type as DisplayFieldType);
}
