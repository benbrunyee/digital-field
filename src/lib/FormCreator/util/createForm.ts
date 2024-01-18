import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { FORM_COLLECTION } from '../../util/types/collections';
import type { Form, UnsavedForm } from '../types/formTypes';

const createFormDoc = async (form: UnsavedForm) => {
	console.log('Creating form', form);
	return await addDoc(collection(firestore, FORM_COLLECTION), form);
};

const updateFormDoc = async (form: Form) => {
	console.log('Updating form', form);
	return await setDoc(doc(firestore, FORM_COLLECTION), form);
};

export const saveFormDoc = async (form: Form | UnsavedForm) => {
	const orgId = get(orgIdStore);
	return 'id' in form ? updateFormDoc({ ...form, orgId }) : createFormDoc({ ...form, orgId });
};

export const createFormStructure = (): UnsavedForm => ({
	name: 'Form Name',
	fields: [],
	outputs: [],
	options: {
		entryStates: []
	},
	status: 'draft',
	type: 'form',
	orgId: get(orgIdStore)
});
