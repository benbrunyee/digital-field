import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { createTimestamps } from '../../util/createTimestamps';

export const onOrgUpdateFn = (
	event: FirestoreEvent<
		Change<QueryDocumentSnapshot> | undefined,
		{
			orgId: string;
		}
	>
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
