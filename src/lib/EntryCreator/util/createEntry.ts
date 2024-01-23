import { createId } from '../../util/createId';
import {
	existingEntrySchema,
	newEntrySchema,
	type ExistingEntry,
	type NewEntry
} from '../types/entryTypes';

export const updateEntryDoc = (entry: ExistingEntry) => {};

export const createEntryDoc = (entry: NewEntry) => {};

export const saveEntryDoc = (entry: NewEntry | ExistingEntry) => {
	const existingEntryParsed = existingEntrySchema.safeParse(entry);
	if (existingEntryParsed.success) {
		return updateEntryDoc(existingEntryParsed.data);
	}

	const newEntryParsed = newEntrySchema.safeParse(entry);
	if (newEntryParsed.success) {
		return createEntryDoc(newEntryParsed.data);
	}
};

export const createEntryStructure = (formId: string, status: string): NewEntry => ({
	clientId: createId('entry-'),
	fields: [],
	formId: formId,
	ownerId: '',
	status
});
