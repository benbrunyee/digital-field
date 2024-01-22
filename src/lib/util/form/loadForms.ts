import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { get } from 'svelte/store';
import { existingFormSchema, type ExistingForm } from '../../FormCreator/types/formTypes';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';

export const loadForm = async (id: string) => {
	const formDoc = await getDoc(doc(firestore, 'forms', id));

	if (!formDoc.exists()) {
		throw new Error('Form does not exist');
	}

	return parseExistingForm(formDoc.data());
};

export const loadOrgForms = async () => {
	const orgId = get(orgIdStore);

	if (!orgId) {
		throw new Error('No orgId');
	}

	const forms = await getDocs(query(collection(firestore, 'forms'), where('orgId', '==', orgId)));

	const formsData = forms.docs.map((doc) => {
		return parseExistingForm(doc.data());
	});

	return formsData;
};

export const parseExistingForm = (form: any): ExistingForm => {
	const timestampFields = ['createdAt', 'updatedAt'];

	const parsedForm: any = {};

	for (const key in form) {
		if (timestampFields.includes(key)) {
			parsedForm[key] = form[key].toDate();
		} else {
			parsedForm[key] = form[key];
		}
	}

	return existingFormSchema.parse(parsedForm);
};
