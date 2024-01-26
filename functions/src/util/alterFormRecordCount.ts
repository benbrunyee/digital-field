import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { warn } from 'firebase-functions/logger';
import { FORM_COLLECTION } from './types/collections';

const firestore = getFirestore();

export const alterFormRecordCount = async (formId: string, type: 'increment' | 'decrement') => {
	const formDoc = await firestore.collection(FORM_COLLECTION).doc(formId).get();

	if (!formDoc.exists) {
		warn(`Form with id ${formId} does not exist, could not decrement record count`);
		return;
	}

	const formData = formDoc.data();

	const formRecordCount = formData?.recordCount;

	if (typeof formRecordCount === 'undefined') {
		warn(`Form with id ${formId} does not have a record count, could not decrement record count`);
		return;
	}

	if (formRecordCount === 0 && type === 'decrement') {
		warn(
			`Form with id ${formId} has a record count of 0, could not decrement record count. This can happen if we reject the creation of a form entry.`
		);
		return;
	}

	// Update the record count of the form
	formDoc.ref.update({
		recordCount: FieldValue.increment(type === 'increment' ? 1 : -1)
	});
};
