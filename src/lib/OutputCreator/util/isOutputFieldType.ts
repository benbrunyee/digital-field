import {
	OutputFieldSchema,
	OutputInputFieldSchema,
	outputDisplayFieldTypes,
	outputFieldTypes,
	type OutputDisplayField,
	type OutputDisplayFieldType,
	type OutputField,
	type OutputInputField,
	type OutputInputFieldType
} from '../types/outputFieldTypes';

export function isOutputField(field: unknown): field is OutputField {
	return OutputFieldSchema.safeParse(field).success;
}

export function isOutputInputField(
	field: unknown
): field is OutputInputField<OutputInputFieldType> {
	return OutputInputFieldSchema.safeParse(field).success;
}

export function isOutputDisplayField(
	field: unknown
): field is OutputDisplayField<OutputDisplayFieldType> {
	return OutputFieldSchema.safeParse(field).success;
}

export function isNewOutputField(item: unknown): item is OutputField {
	return (
		item !== null &&
		typeof item === 'object' &&
		'newField' in item &&
		Boolean(item.newField) &&
		'type' in item &&
		typeof item.type === 'string' &&
		outputFieldTypes.includes(item.type as (typeof outputFieldTypes)[number])
	);
}

export function isOutputDisplayFieldType(type: unknown): type is OutputDisplayFieldType {
	return outputDisplayFieldTypes.includes(type as OutputDisplayFieldType);
}

export function isOutputInputFieldType(type: unknown): type is OutputInputFieldType {
	return outputFieldTypes.includes(type as OutputInputFieldType);
}
