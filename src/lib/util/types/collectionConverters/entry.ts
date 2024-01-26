import { existingEntrySchema } from '../../../EntryCreator/types/entryTypes';

export const parseExistingEntry = (entry: any) => {
	return existingEntrySchema.parse(entry);
};
