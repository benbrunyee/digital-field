import {
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAt as startAtDoc,
	where
} from 'firebase/firestore';
import { get } from 'svelte/store';
import type { ExistingForm } from '../../FormCreator/types/formTypes';
import { orgIdStore } from '../../stores/org';
import { FORM_COLLECTION } from '../types/collections';

export const loadForm = async (id: string): Promise<ExistingForm | undefined> => {
	const formDoc = await getDoc(doc(FORM_COLLECTION, id));
	return formDoc.data();
};

export const loadOrgForms = async (start?: number, limit?: number): Promise<ExistingForm[]> => {
	const startAt = start ?? 0;
	const limitTo = limit ?? 10;

	if (startAt < 0) {
		throw new Error('Starting index of doc must be greater than or equal to 0');
	}

	if (limitTo < 1) {
		throw new Error('Limit of docs must be greater than or equal to 1');
	}

	const orgId = get(orgIdStore);

	if (!orgId) {
		throw new Error('No orgId');
	}

	const forms = await getDocs(
		query(
			FORM_COLLECTION,
			where('orgId', '==', orgId),
			orderBy('updatedAt', 'desc'),
			startAtDoc(startAt),
			limitDoc(limitTo)
		)
	);

	if (forms.empty) {
		return [];
	}

	const formDocs = forms.docs.map((doc) => doc.data());

	return formDocs;
};
