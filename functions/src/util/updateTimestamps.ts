import { QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';

export const updateTimestamp = (
	event:
		| FirestoreEvent<QueryDocumentSnapshot | undefined, any>
		| FirestoreEvent<Change<QueryDocumentSnapshot> | undefined, any>,
	{ includeCreatedAt } = { includeCreatedAt: false }
) => {
	if (!event.data) {
		return;
	}

	if ('ref' in event.data) {
		event.data.ref.set(
			{
				id: event.data.id,
				updatedAt: event.data.updateTime,
				...(includeCreatedAt ? { createdAt: event.data.createTime } : {})
			},
			{ merge: true }
		);
	} else {
		if (
			!(
				event.data.before.data().updatedAt &&
				event.data.before.data().updatedAt instanceof Timestamp
			) ||
			event.data.before.data().updatedAt.seconds !== event.data.after.updateTime.seconds
		) {
			event.data.after.ref.set(
				{
					id: event.data.after.id,
					updatedAt: event.data.after.updateTime,
					...(includeCreatedAt ? { createdAt: event.data.after.createTime } : {})
				},
				{ merge: true }
			);
		}
	}
};
