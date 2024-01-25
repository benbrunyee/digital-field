import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAfter as startAfterDoc
} from 'firebase/firestore';
import { existingEntrySchema } from '../../EntryCreator/types/entryTypes';
import { firestore } from '../../firebase';
import { ENTRY_COLLECTION, FORM_COLLECTION } from '../types/collections';
import { isFirestoreTimestamp } from '../types/isFirestoreTimestamp';

export const loadEntries = async (formId: string, start?: number, limit?: number) => {
	const startAfter = start ? start : 0;
	const limitTo = limit ? limit : 10;

	const entryDocs = await getDocs(
		query(
			collection(firestore, FORM_COLLECTION, formId, ENTRY_COLLECTION),
			orderBy('updatedAt', 'desc'),
			startAfterDoc(startAfter),
			limitDoc(limitTo)
		)
	);

	const entries = entryDocs.docs.map((doc) => {
		return parseEntry(doc.data());
	});

	return entries;
};

export const loadEntry = async (formId: string, entryId: string) => {
	const entryDoc = await getDoc(doc(firestore, FORM_COLLECTION, formId, ENTRY_COLLECTION, entryId));

	if (!entryDoc.exists()) {
		return;
	}

	return parseEntry(entryDoc.data());
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
