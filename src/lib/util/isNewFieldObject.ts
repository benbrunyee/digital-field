import { fieldTypes } from '../FormCreator/types/fieldTypes';
import { outputDisplayFieldTypes } from '../OutputCreator/types/outputFieldTypes';

export function isNewField(
	item: unknown
): item is { newField: true; type: (typeof fieldTypes)[number] | typeof outputDisplayFieldTypes } {
	return (
		item !== null &&
		typeof item === 'object' &&
		'newField' in item &&
		Boolean(item.newField) &&
		'type' in item &&
		typeof item.type === 'string' &&
		(fieldTypes.includes(item.type as (typeof fieldTypes)[number]) ||
			outputDisplayFieldTypes.includes(item.type as (typeof outputDisplayFieldTypes)[number]))
	);
}
