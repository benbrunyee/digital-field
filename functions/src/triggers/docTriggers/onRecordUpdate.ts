import { Change, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { createTimestamps } from '../../util/createTimestamps';

export const onRecordUpdateFn = (
	event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, any>
) => {
	let changesMade = false;

	if (!event.data) {
		return;
	}

	const updateDocObj: any = {};

	const timestamps = createTimestamps(event);

	if (timestamps) {
		changesMade = true;
		updateDocObj.updatedAt = timestamps.updatedAt;

		if (timestamps.createdAt) {
			updateDocObj.createdAt = timestamps.createdAt;
		}
	}

	if (changesMade) {
		return event.data.after.ref.update(updateDocObj);
	}

	return;
};
