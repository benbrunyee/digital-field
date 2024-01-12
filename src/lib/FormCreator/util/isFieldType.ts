import {
	DisplayFieldSchema,
	FormFieldSchema,
	InputFieldSchema,
	allFormFieldTypes,
	type DisplayField,
	type DisplayFieldType,
	type FormField,
	type InputField,
	type InputFieldType
} from '../types/fieldTypes';

export function isField(field: unknown): field is FormField {
	return FormFieldSchema.safeParse(field).success;
}

export function isInputField(field: unknown): field is InputField<InputFieldType> {
	return InputFieldSchema.safeParse(field).success;
}

export function isInputFieldType(type: unknown): type is InputFieldType {
	return allFormFieldTypes.includes(type as InputFieldType);
}

export function isDisplayField(field: unknown): field is DisplayField<DisplayFieldType> {
	return DisplayFieldSchema.safeParse(field).success;
}

export function isDisplayFieldType(type: unknown): type is DisplayFieldType {
	return allFormFieldTypes.includes(type as DisplayFieldType);
}

export function isNewField(
	item: unknown
): item is { newField: true; type: (typeof allFormFieldTypes)[number] } {
	return (
		item !== null &&
		typeof item === 'object' &&
		'newField' in item &&
		Boolean(item.newField) &&
		'type' in item &&
		typeof item.type === 'string' &&
		allFormFieldTypes.includes(item.type as (typeof allFormFieldTypes)[number])
	);
}
