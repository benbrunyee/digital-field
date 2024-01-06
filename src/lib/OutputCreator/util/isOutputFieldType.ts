import {
	OutputFieldISchema,
	OutputInputFieldISchema,
	outputFieldTypes,
	type OutputDisplayFieldI,
	type OutputDisplayFieldType,
	type OutputFieldI,
	type OutputInputFieldI,
	type OutputInputFieldType
} from '../types/outputFieldTypes';

export function isOutputField(field: unknown): field is OutputFieldI {
	return OutputFieldISchema.safeParse(field).success;
}

export function isOutputInputField(
	field: unknown
): field is OutputInputFieldI<OutputInputFieldType> {
	return OutputInputFieldISchema.safeParse(field).success;
}

export function isOutputDisplayField(
	field: unknown
): field is OutputDisplayFieldI<OutputDisplayFieldType> {
	return OutputFieldISchema.safeParse(field).success;
}

export function isNewOutputField(item: unknown): item is OutputFieldI {
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
