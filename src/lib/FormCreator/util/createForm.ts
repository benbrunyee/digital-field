import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import { firestore } from '../../firebase';
import { orgIdStore } from '../../stores/org';
import { FORM_COLLECTION } from '../../util/types/collections';
import type { WithId } from '../../util/types/withId';
import type { UnsavedFormField } from '../types/fieldTypes';
import { unsavedFormSchema, type Form, type UnsavedForm } from '../types/formTypes';

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

	const formObj = form;

	const unsavedForm = unsavedFormSchema.safeParse(formObj);
	if (unsavedForm.success) {
		unsavedForm.data.fields;
	}

	return 'id' in form ? updateFormDoc({ ...formObj, orgId }) : createFormDoc({ ...formObj, orgId });
};

const removeIdFromFields = (fields: WithId<UnsavedFormField>[]) => {
	return fields.map((field) => {
		const { id, ...rest } = field;
		return rest;
	});
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
