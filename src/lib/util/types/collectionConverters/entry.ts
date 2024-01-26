import type { DocumentData } from 'firebase/firestore';
import { existingEntrySchema, type ExistingEntry } from '../../../EntryCreator/types/entryTypes';

export const parseExistingEntry = (entry: DocumentData): ExistingEntry => {
	console.log(entry);
	return existingEntrySchema.parse(entry);
};
