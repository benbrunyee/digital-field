import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';

export const createTimestamps = (
	event:
		| FirestoreEvent<QueryDocumentSnapshot | undefined, any>
		| FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, any>,
	{ includeCreatedAt } = { includeCreatedAt: false }
) => {
	if (!event.data) {
		return;
	}

	if ('ref' in event.data) {
		return {
			updatedAt: event.data.updateTime,
			...(includeCreatedAt ? { createdAt: event.data.createTime } : {})
		};
	} else {
		if (
			!(
				event.data.before.data().updatedAt &&
				event.data.before.data().updatedAt instanceof Timestamp
			) ||
			event.data.before.data().updatedAt.seconds !== event.data.after.updateTime.seconds
		) {
			return {
				updatedAt: event.data.after.updateTime,
				...(includeCreatedAt ? { createdAt: event.data.after.createTime } : {})
			};
		}
	}

	return;
};
