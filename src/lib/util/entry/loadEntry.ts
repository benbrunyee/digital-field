import {
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAt as startAtDoc
} from 'firebase/firestore';
import { type ExistingEntry } from '../../EntryCreator/types/entryTypes';
import { ENTRY_COLLECTION } from '../types/collections';

export const loadEntries = async (
	formId: string,
	start?: number,
	limit?: number
): Promise<ExistingEntry[]> => {
	const startAt = start ?? 0;
	const limitTo = limit ?? 10;

	if (startAt < 0) {
		throw new Error('Starting index of doc must be greater than or equal to 0');
	}

	if (limitTo < 1) {
		throw new Error('Limit of docs must be greater than or equal to 1');
	}

	const entryDocs = await getDocs(
		query(
			ENTRY_COLLECTION(formId),
			orderBy('updatedAt', 'desc'),
			startAtDoc(startAt),
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
