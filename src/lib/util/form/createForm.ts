import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import {
	existingFormSchema,
	formCreateRequestSchema,
	newFormSchema,
	type ExistingForm,
	type FormCreateRequest,
	type NewForm
} from '../../FormCreator/types/formTypes';
import { auth } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { createId } from '../createId';
import { FORM_COLLECTION } from '../types/collections';

const createFormDoc = async (form: NewForm) => {
	console.debug('Creating form', form);

	const { clientId, ...formWithoutClientId } = form;

	// Transform the new form into a form that can be saved to the database
	let formRequest: FormCreateRequest = {
		...formWithoutClientId,
		fields: form.fields.map((field) => {
			// Remove the clientId from each field
			const { clientId, ...fieldWithoutClientId } = field;
			return fieldWithoutClientId;
		})
	};

	const formRequestObj = formCreateRequestSchema.parse(formRequest);
	console.debug('Form request', formRequestObj);

	return await addDoc(FORM_COLLECTION, formRequest);
};

const updateFormDoc = async (form: ExistingForm) => {
	console.debug('Updating form', form);
	return await updateDoc(doc(FORM_COLLECTION, form.id), form);
};

export const saveFormDoc = async (form: NewForm | ExistingForm) => {
	const existingFormParsed = existingFormSchema.safeParse(form);
	if (existingFormParsed.success) {
		return await updateFormDoc(existingFormParsed.data);
	}

	const newFormParsed = newFormSchema.safeParse(form);
	if (newFormParsed.success) {
		return await createFormDoc(newFormParsed.data);
	}

	throw new Error('Form not valid');
};

export const createFormStructure = (): NewForm => {
	const uid = auth.currentUser?.uid;
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
		name: 'My Form',
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
