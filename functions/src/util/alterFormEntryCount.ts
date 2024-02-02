import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { warn } from 'firebase-functions/logger';
import { FORM_COLLECTION } from './types/collections';

const firestore = getFirestore();

export const alterFormEntryCount = async (formId: string, type: 'increment' | 'decrement') => {
	const formDoc = await firestore.collection(FORM_COLLECTION).doc(formId).get();

	if (!formDoc.exists) {
		warn(`Form with id ${formId} does not exist, could not decrement entry count`);
		return;
	}

	const formData = formDoc.data();

	const formEntryCount = formData?.entryCount;

	if (typeof formEntryCount === 'undefined') {
		warn(`Form with id ${formId} does not have a entry count, could not decrement entry count`);
		return;
	}

	if (formEntryCount === 0 && type === 'decrement') {
		warn(
			`Form with id ${formId} has a entry count of 0, could not decrement entry count. This can happen if we reject the creation of a form entry.`
		);
		return;
	}

	// Update the entry count of the form
	formDoc.ref.update({
		entryCount: FieldValue.increment(type === 'increment' ? 1 : -1)
	});
};
