import { QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import { error } from 'firebase-functions/logger';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { addActivityLog } from '../../util/addActivityLogs';
import { alterFormRecordCount } from '../../util/alterFormRecordCount';
import { createTimestamps } from '../../util/createTimestamps';
import { FORM_COLLECTION } from '../../util/types/collections';

const firestore = getFirestore();

export const onEntryCreateFn = async (
	event: FirestoreEvent<QueryDocumentSnapshot | undefined, {}>
) => {
	if (!event.data) {
		return;
	}

	const formId = event.data.ref.parent?.parent?.id;

	if (!formId) {
		error(
			`Entry created with no parent form. Entry ID: ${
				event.data.ref.id
			}. Entry data: ${JSON.stringify(event.data.data())}`
		);
		event.data.ref.delete();
		return;
	}

	const updatedDocObj: any = {
		id: event.data.ref.id,
		formId
	};

	const timestamps = createTimestamps(event, { includeCreatedAt: true });

	if (timestamps) {
		updatedDocObj.updatedAt = timestamps.updatedAt;

		if (timestamps.createdAt) {
			updatedDocObj.createdAt = timestamps.createdAt;
		}
	} else {
		error(
			`Entry created with no timestamps. Entry ID: ${
				event.data.ref.id
			}. Entry data: ${JSON.stringify(event.data.data())}`
		);
	}

	// Update the record count of the form
	await alterFormRecordCount(formId, 'increment');

	// Get the entry data
	const docData = event.data.data();

	// Get the form data
	const formSnap = await firestore.collection(FORM_COLLECTION).doc(formId).get();
	const formData = formSnap.data();

	// Add activity log
	if (timestamps?.createdAt && docData?.ownerId && formData?.name) {
		await addActivityLog(formId, 'created-entry', {
			createdAt: timestamps.createdAt,
			title: `1 entry created in ${formData.name}`,
			authorId: docData.ownerId,
			count: 1,
			formName: formData.name
		});
	} else {
		error(`Entry created without an activity log entry. Entry ID: ${event.data.ref.id}`);
	}

	return event.data.ref.update(updatedDocObj);
};
