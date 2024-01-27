import { getFirestore } from 'firebase-admin/firestore';
import { error } from 'firebase-functions/logger';
import { Change, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { addActivityLog } from '../../util/addActivityLogs';
import { createTimestamps } from '../../util/createTimestamps';
import { FORM_COLLECTION } from '../../util/types/collections';

const firestore = getFirestore();

export const onEntryUpdateFn = async (
	event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>
) => {
	let changesMade = false;

	if (!event.data) {
		return;
	}

	const updatedDocObj: any = {};

	const formId = event.data.after.ref.parent?.parent?.id;

	if (!formId) {
		error(
			`Entry updated with no parent form. Entry ID: ${
				event.data.after.ref.id
			}. Entry data: ${JSON.stringify(event.data.after.data())}`
		);
		return;
	}

	const timestamps = createTimestamps(event);

	if (timestamps) {
		changesMade = true;
		updatedDocObj.updatedAt = timestamps.updatedAt;
	} else {
		error(
			`Entry updated with no timestamps. Entry ID: ${
				event.data.after.ref.id
			}. Entry data: ${JSON.stringify(event.data.after.data())}`
		);
	}

	// Get the entry data
	const docData = event.data.after.data();

	// Get the form data
	const formSnap = await firestore.collection(FORM_COLLECTION).doc(formId).get();
	const formData = formSnap.data();

	if (timestamps?.updatedAt && docData?.ownerId && formData?.name) {
		await addActivityLog(formId, 'updated-entry', {
			createdAt: timestamps.updatedAt,
			title: `1 entry updated in ${formData?.name}`,
			authorId: docData?.ownerId,
			count: 1,
			formName: formData?.name
		});
	} else {
		error(`Entry update without an activity log entry. Entry ID: ${event.data.after.ref.id}`);
	}

	return event.data.after.ref.update(updatedDocObj);
};
