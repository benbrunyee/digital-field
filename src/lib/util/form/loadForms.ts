import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { get } from 'svelte/store';
import { existingFormSchema, type ExistingForm } from '../../FormCreator/types/formTypes';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { isFirestoreTimestamp } from '../types/isFirestoreTimestamp';

export const loadForm = async (id: string) => {
	const formDoc = await getDoc(doc(firestore, 'forms', id));

	if (!formDoc.exists()) {
		throw new Error('Form does not exist');
	}

	return parseExistingForm(formDoc.data());
};

export const loadOrgForms = async (start?: number, limit?: number) => {
	const startAfter = start ? start : 0;
	const limitTo = limit ? limit : 10;

	const orgId = get(orgIdStore);

	if (!orgId) {
		throw new Error('No orgId');
	}

	const forms = await getDocs(query(collection(firestore, 'forms'), where('orgId', '==', orgId)));

	if (forms.empty) {
		return [];
	}

	const formsData = forms.docs.map((doc) => parseExistingForm(doc.data()));

	return formsData;
};

export const parseExistingForm = (form: any): ExistingForm => {
	const timestampFields = ['createdAt', 'updatedAt'];

	const parsedForm: any = Object.assign({}, form);

	for (const key of timestampFields) {
		if (key in parsedForm) {
			const field = parsedForm[key];

			if (isFirestoreTimestamp(field)) {
				parsedForm[key] = field.toDate();
			}
		}
	}

	const existingFormParsed = existingFormSchema.parse(parsedForm);

	return existingFormParsed;
};
