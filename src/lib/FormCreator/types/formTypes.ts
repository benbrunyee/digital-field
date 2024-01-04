import type { FieldI } from './fieldTypes';
import type { OutputEntity } from './outputFormTypes';

/**
 * A form is what you would expect, a entity that contains fields specifically for inputting data.
 * A form determines what data can be collected for the entity.
 * This data can then be used in an output e.g., PDF.
 */

export interface Form {
	id: string;
	name: string;
	fields: FieldI[];
	outputs: OutputEntity[];
	owner: string;
	last_updated: string;
	created: string;
}
