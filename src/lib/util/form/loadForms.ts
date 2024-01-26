import {
	doc,
	getDoc,
	getDocs,
	limit as limitDoc,
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

export const loadOrgForms = async (start?: number, limit?: number): Promise<ExistingForm[]> => {
	const startAfter = start ? start : 0;
	const limitTo = limit ? limit : 10;

	const orgId = get(orgIdStore);

	if (!orgId) {
		throw new Error('No orgId');
	}

	const forms = await getDocs(
		query(
			FORM_COLLECTION,
			where('orgId', '==', orgId),
			startAfterDoc(startAfter),
			limitDoc(limitTo)
		)
	);

	if (forms.empty) {
		return [];
	}

	const formDocs = forms.docs.map((doc) => doc.data());

	return formDocs;
};
