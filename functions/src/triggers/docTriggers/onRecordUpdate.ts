import { Change, FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { updateTimestamp } from '../../util/updateTimestamps';

export const onRecordUpdateFn = (
	event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, any>
) => {
	if (!event.data) {
		return;
	}

	updateTimestamp(event);
};
