import type { OutputEntityI } from '../../OutputCreator/types/outputEntityTypes';
import type { FieldI } from './fieldTypes';

/**
 * A form is what you would expect, a entity that contains fields specifically for inputting data.
 * A form determines what data can be collected for the entity.
 * This data can then be used in an output e.g., PDF.
 */

export interface Form {
	id: string;
	name: string;
	fields: FieldI[];
	outputs: OutputEntityI[];
	owner: string;
	updatedAt: Date | undefined;
	createdAt: Date | undefined;
}
