import type { Field, FieldType } from './fieldTypes';
import type { OutputForm } from './outputFormTypes';

export interface Form {
	id: string;
	name: string;
	fields: Field<FieldType>[];
	outputs: OutputForm[];
	owner: string;
	last_updated: string;
	created: string;
}
