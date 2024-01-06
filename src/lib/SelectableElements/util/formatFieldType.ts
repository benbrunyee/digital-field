import type { AllFieldTypes } from '../types/fieldTypes';

const preformattedFieldTypes: {
	[k in AllFieldTypes]?: string;
} = {
	html: 'HTML'
};

export function formatFieldType(typeName: AllFieldTypes) {
	return (
		preformattedFieldTypes[typeName] ??
		typeName.charAt(0).toUpperCase() + typeName.slice(1).replace(/_/g, ' ')
	);
}
