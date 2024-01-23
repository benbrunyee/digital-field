import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { addId } from '../../util/addId';
import { updateTimestamp } from '../../util/updateTimestamps';

export const onRecordCreateFn = (
	event: FirestoreEvent<QueryDocumentSnapshot | undefined, {}>
): void => {
	updateTimestamp(event, {
		includeCreatedAt: true
	});
	addId(event);
};
