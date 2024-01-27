import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { error } from 'firebase-functions/logger';
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
	} else {
		error(
			`Org updated with no timestamps. Org ID: ${
				event.data.after.ref.id
			}. Org data: ${JSON.stringify(event.data.after.data())}`
		);
	}

	if (changesMade) {
		return event.data.after.ref.update(updateDocObj);
	}

	return;
};
