import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { createId } from '../../util/createId';
import { FORM_COLLECTION } from '../../util/types/collections';
import { userStore } from '../../util/user/stores/userStore';
import {
	existingFormSchema,
	formCreateRequestSchema,
	formUpdateRequestSchema,
	newFormSchema,
	type ExistingForm,
	type FormCreateRequest,
	type NewForm
} from '../types/formTypes';

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

	return await addDoc(collection(firestore, FORM_COLLECTION), formRequest);
};

const updateFormDoc = async (form: ExistingForm) => {
	console.debug('Updating form', form);

	const formRequestObj = formUpdateRequestSchema.parse(form);
	console.debug('Form request', formRequestObj);

	return await updateDoc(doc(firestore, FORM_COLLECTION, form.id), formRequestObj);
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
