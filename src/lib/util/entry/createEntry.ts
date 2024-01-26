import { addDoc, doc, updateDoc } from 'firebase/firestore';
import {
	entryCreateRequestSchema,
	entryUpdateRequestSchema,
	existingEntrySchema,
	newEntrySchema,
	type AddressValueSchema,
	type EntryCreateRequest,
	type ExistingEntry,
	type NewEntry,
	type NewEntryField
} from '../../EntryCreator/types/entryTypes';
import type { ExistingForm } from '../../FormCreator/types/formTypes';
import { isExistingDisplayField, isExistingInputField } from '../../FormCreator/util/isFieldType';
import { auth } from '../../firebase';
import { createId } from '../createId';
import { loadForm } from '../form/loadForms';
import { ENTRY_COLLECTION } from '../types/collections';

export const updateEntryDoc = async (formId: string, entry: ExistingEntry) => {
	console.debug('Updating entry', entry, 'in form', formId);
	return await updateDoc(
		doc(ENTRY_COLLECTION(formId), entry.id),
		entryUpdateRequestSchema.parse(entry)
	);
};

export const createEntryDoc = async (formId: string, entry: NewEntry) => {
	console.debug('Creating entry', entry, 'in form', formId);

	const { clientId, ...entryWithoutFields } = entry;

	let entryRequest: EntryCreateRequest = entryWithoutFields;

	const entryRequestObj = entryCreateRequestSchema.parse(entryRequest);
	console.debug('Entry request', entryRequestObj);

	return await addDoc(ENTRY_COLLECTION(formId), entryRequestObj);
};

export const saveEntryDoc = async (formId: string, entry: NewEntry | ExistingEntry) => {
	const existingEntryParsed = existingEntrySchema.safeParse(entry);
	if (existingEntryParsed.success) {
		return await updateEntryDoc(formId, existingEntryParsed.data);
	}

	const newEntryParsed = newEntrySchema.safeParse(entry);
	if (newEntryParsed.success) {
		return await createEntryDoc(formId, newEntryParsed.data);
	}
};

export const createEntryStoreStructure = async (
	formId: string
): Promise<{
	entry: ExistingEntry | NewEntry;
	form: ExistingForm;
}> => {
	const uid = auth.currentUser?.uid;
	const form = await loadForm(formId);

	if (!uid) {
		throw new Error('User not logged in');
	}

	if (!form) {
		throw new Error('No form found');
	}

	const fields = form.fields.reduce<Record<string, NewEntryField>>((r, field) => {
		if (!(isExistingInputField(field) || isExistingDisplayField(field))) {
			return r;
		}

		const entryField: NewEntryField = {
			clientId: createId('entry'),
			fieldId: field.id,
			value: ''
		};

		if (field.type === 'address') {
			entryField.value = createAddressValue();
		} else if (field.type === 'checkbox') {
			entryField.value = false;
		} else if (field.type === 'multi-entry') {
			entryField.value = [];
		}

		r[field.id] = entryField;
		return r;
	}, {});

	return {
		entry: {
			clientId: createId('entry'),
			fields,
			formId: form.id,
			ownerId: uid,
			status: ''
		},
		form
	};
};

const createAddressValue = (): AddressValueSchema => ({
	street1: '',
	street2: '',
	city: '',
	state: '',
	postalCode: '',
	country: ''
});
