import {
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAfter as startAfterDoc
} from 'firebase/firestore';
import { existingEntrySchema, type ExistingEntry } from '../../EntryCreator/types/entryTypes';
import { ENTRY_COLLECTION } from '../types/collections';
import { isFirestoreTimestamp } from '../types/isFirestoreTimestamp';

export const loadEntries = async (
	formId: string,
	start?: number,
	limit?: number
): Promise<ExistingEntry[]> => {
	const startAfter = start ? start : 0;
	const limitTo = limit ? limit : 10;

	const entryDocs = await getDocs(
		query(
			ENTRY_COLLECTION(formId),
			orderBy('updatedAt', 'desc'),
			startAfterDoc(startAfter),
			limitDoc(limitTo)
		)
	);

	const entries = entryDocs.docs.map((doc) => doc.data());

	return entries;
};

export const loadEntry = async (
	formId: string,
	entryId: string
): Promise<ExistingEntry | undefined> => {
	const entryDoc = await getDoc(doc(ENTRY_COLLECTION(formId), entryId));
	return entryDoc.data();
};

export const parseEntry = (entry: any) => {
	const dateFields = ['createdAt', 'updatedAt'];

	for (const field of dateFields) {
		if (field in entry && isFirestoreTimestamp(entry[field])) {
			entry[field] = entry[field].toDate();
		}
	}

	const existingEntryParsed = existingEntrySchema.parse(entry);

	return existingEntryParsed;
};
