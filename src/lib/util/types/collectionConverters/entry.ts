import { existingEntrySchema, type ExistingEntry } from '../../../EntryCreator/types/entryTypes';
import { convertFirestoreTimestamps } from '../convertFirestoreTimestamp';

export const parseExistingEntry = (entry: any) => {
	const dateFields: (keyof Partial<ExistingEntry>)[] = ['createdAt', 'updatedAt'];
	return existingEntrySchema.parse(convertFirestoreTimestamps(entry, dateFields));
};
