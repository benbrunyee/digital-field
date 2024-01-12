import { allFormFieldTypes } from '../FormCreator/types/fieldTypes';
import { outputDisplayFieldTypes } from '../OutputCreator/types/outputFieldTypes';

export function isNewField(item: unknown): item is {
	newField: true;
	type: (typeof allFormFieldTypes)[number] | typeof outputDisplayFieldTypes;
} {
	return (
		item !== null &&
		typeof item === 'object' &&
		'newField' in item &&
		Boolean(item.newField) &&
		'type' in item &&
		typeof item.type === 'string' &&
		(allFormFieldTypes.includes(item.type as (typeof allFormFieldTypes)[number]) ||
			outputDisplayFieldTypes.includes(item.type as (typeof outputDisplayFieldTypes)[number]))
	);
}
