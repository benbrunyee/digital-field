import {
	existingOutputDisplayFieldSchema,
	existingOutputInputFieldSchema,
	newOutputDisplayFieldSchema,
	newOutputInputFieldSchema,
	outputDisplayFieldSchema,
	outputDisplayFieldTypes,
	outputFieldSchema,
	outputFieldTypes,
	outputInputFieldSchema,
	type ExistingOutputDisplayField,
	type ExistingOutputInputField,
	type NewOutputDisplayField,
	type NewOutputInputField,
	type OutputDisplayField,
	type OutputDisplayFieldType,
	type OutputField,
	type OutputInputField,
	type OutputInputFieldType
} from '../types/outputFieldTypes';

export function isOutputField(field: unknown): field is OutputField {
	return outputFieldSchema.safeParse(field).success;
}

// Output Display field

export function isOutputDisplayField(field: unknown): field is OutputDisplayField {
	return outputDisplayFieldSchema.safeParse(field).success;
}

export function isExistingOutputDisplayField(field: unknown): field is ExistingOutputDisplayField {
	return existingOutputDisplayFieldSchema.safeParse(field).success;
}

export function isNewOutputDisplayField(item: unknown): item is NewOutputDisplayField {
	return newOutputDisplayFieldSchema.safeParse(item).success;
}

export function isOutputDisplayFieldType(type: unknown): type is OutputDisplayFieldType {
	return outputDisplayFieldTypes.includes(type as OutputDisplayFieldType);
}

// Output Input field

export function isOutputInputField(field: unknown): field is OutputInputField {
	return outputInputFieldSchema.safeParse(field).success;
}

export function isExistingOutputInputField(field: unknown): field is ExistingOutputInputField {
	return existingOutputInputFieldSchema.safeParse(field).success;
}

export function isNewOutputInputField(item: unknown): item is NewOutputInputField {
	return newOutputInputFieldSchema.safeParse(item).success;
}

export function isOutputInputFieldType(type: unknown): type is OutputInputFieldType {
	return outputFieldTypes.includes(type as OutputInputFieldType);
}
