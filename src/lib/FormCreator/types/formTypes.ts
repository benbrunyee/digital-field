import type { InputEntity } from '../../InputEntity/types/inputEntity';
import type { OutputEntity } from '../../OutputCreator/types/outputEntityTypes';
import type { FormField } from './fieldTypes';

/**
 * A form is what you would expect, a entity that contains fields specifically for inputting data.
 * A form determines what data can be collected for the entity.
 * This data can then be used in an output e.g., PDF.
 */

export interface Form extends InputEntity<Form, FormField> {
	ownerId: string;
	status: FormStatus;
	options: FormOptions;
	outputs: OutputEntity[];
}

export type FormOptions = {
	entryStates: EntryState[];
};

export type EntryState = {
	name: string;
	colour: string;
};

export type FormStatus = 'draft' | 'active' | 'disabled' | 'deleted';
