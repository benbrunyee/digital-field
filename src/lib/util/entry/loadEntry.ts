import {
	DocumentReference,
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAfter as startAfterDoc
} from 'firebase/firestore';
import { type ExistingEntry } from '../../EntryCreator/types/entryTypes';
import { ENTRY_COLLECTION } from '../types/collections';

export const loadEntries = async (
	formId: string,
	startAfter?: DocumentReference,
	limit?: number
): Promise<ExistingEntry[]> => {
	const limitTo = limit ?? 10;

	if (limitTo < 1) {
		throw new Error('Limit of docs must be greater than or equal to 1');
	}

	const docQuery = startAfter
		? query(
				ENTRY_COLLECTION(formId),
				orderBy('updatedAt', 'desc'),
				startAfterDoc(startAfter),
				limitDoc(limitTo)
			)
		: query(ENTRY_COLLECTION(formId), orderBy('updatedAt', 'desc'), limitDoc(limitTo));

	const entryDocs = await getDocs(docQuery);

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
