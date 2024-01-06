import {
	DisplayFieldISchema,
	FieldISchema,
	InputFieldISchema,
	fieldTypes,
	type DisplayFieldI,
	type DisplayFieldType,
	type FieldI,
	type InputFieldI,
	type InputFieldType
} from '../types/fieldTypes';

export function isField(field: unknown): field is FieldI {
	return FieldISchema.safeParse(field).success;
}

export function isInputField(field: unknown): field is InputFieldI<InputFieldType> {
	return InputFieldISchema.safeParse(field).success;
}

export function isInputFieldType(type: unknown): type is InputFieldType {
	return fieldTypes.includes(type as InputFieldType);
}

export function isDisplayField(field: unknown): field is DisplayFieldI<DisplayFieldType> {
	return DisplayFieldISchema.safeParse(field).success;
}

export function isDisplayFieldType(type: unknown): type is DisplayFieldType {
	return fieldTypes.includes(type as DisplayFieldType);
}

export function isNewField(
	item: unknown
): item is { newField: true; type: (typeof fieldTypes)[number] } {
	return (
		item !== null &&
		typeof item === 'object' &&
		'newField' in item &&
		Boolean(item.newField) &&
		'type' in item &&
		typeof item.type === 'string' &&
		fieldTypes.includes(item.type as (typeof fieldTypes)[number])
	);
}
