import type { EntryState } from '../../FormCreator/types/formTypes';
import { createId } from '../../util/createId';
import type { Entry } from '../types/entryTypes';

export const createEntryStructure = <T extends EntryState>(
	formId: string,
	status?: T
): Entry<T> => ({
	id: createId('entry'),
	createdAt: new Date(),
	updatedAt: new Date(),
	fields: [],
	formId: formId,
	ownerId: '',
	status
});
