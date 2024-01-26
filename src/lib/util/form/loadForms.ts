import {
	DocumentReference,
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
	orderBy,
	query,
	startAfter as startAfterDoc,
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

export const loadOrgForms = async (
	startAfter?: DocumentReference,
	limit?: number
): Promise<ExistingForm[]> => {
	const limitTo = limit ?? 10;

	if (limitTo < 1) {
		throw new Error('Limit of docs must be greater than or equal to 1');
	}

	const orgId = get(orgIdStore);

	if (!orgId) {
		throw new Error('No orgId');
	}

	const docQuery = startAfter
		? query(
				FORM_COLLECTION,
				where('orgId', '==', orgId),
				orderBy('updatedAt', 'desc'),
				startAfterDoc(startAfter),
				limitDoc(limitTo)
			)
		: query(
				FORM_COLLECTION,
				where('orgId', '==', orgId),
				orderBy('updatedAt', 'desc'),
				limitDoc(limitTo)
			);

	const forms = await getDocs(docQuery);

	if (forms.empty) {
		return [];
	}

	const formDocs = forms.docs.map((doc) => doc.data());

	return formDocs;
};
