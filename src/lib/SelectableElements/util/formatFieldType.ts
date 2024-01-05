import type { AllFieldTypes } from '../types/fieldTypes';

export function formatFieldType(typeName: AllFieldTypes) {
	return typeName.charAt(0).toUpperCase() + typeName.slice(1).replace(/_/g, ' ');
}
