import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { createId } from '../../util/createId';
import { FORM_COLLECTION } from '../../util/types/collections';
import { userStore } from '../../util/user/stores/userStore';
import type { ExistingForm, NewForm } from '../types/formTypes';

const createFormDoc = async (form: NewForm) => {
	console.log('Creating form', form);
	return await addDoc(collection(firestore, FORM_COLLECTION), form);
};

const updateFormDoc = async (form: ExistingForm) => {
	console.log('Updating form', form);
	return await setDoc(doc(firestore, FORM_COLLECTION), form);
};

export const saveFormDoc = async (form: NewForm | ExistingForm) => {
	const orgId = get(orgIdStore);

	const formObj = form;

	// TODO: Implement
};

export const createFormStructure = (): NewForm => {
	const uid = get(userStore).id;
	const orgId = get(orgIdStore);

	if (!uid) {
		throw new Error('User not logged in');
	}

	if (!orgId) {
		throw new Error('Org not selected');
	}

	return {
		clientId: createId('form'),
		ownerId: uid,
		name: 'Form Name',
		fields: [],
		outputs: [],
		options: {
			entryStates: []
		},
		status: 'draft',
		type: 'form',
		orgId
	};
};
