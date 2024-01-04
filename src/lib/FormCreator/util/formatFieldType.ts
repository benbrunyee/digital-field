import type { FieldTypes } from '../types/fieldTypes';

export function formatFieldType(typeName: FieldTypes) {
	return typeName.charAt(0).toUpperCase() + typeName.slice(1).replace(/_/g, ' ');
}
