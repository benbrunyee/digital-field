import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { createTimestamps } from '../../util/createTimestamps';

export const onOrgCreateFn = (
	event: FirestoreEvent<
		QueryDocumentSnapshot | undefined,
		{
			orgId: string;
		}
	>
) => {
	if (!event.data) {
		return;
	}

	const updatedDocObj: any = {
		id: event.id
	};

	const timestamps = createTimestamps(event, { includeCreatedAt: true });

	if (timestamps) {
		updatedDocObj.updatedAt = timestamps.updatedAt;

		if (timestamps.createdAt) {
			updatedDocObj.createdAt = timestamps.createdAt;
		}
	}

	return event.data.ref.update(updatedDocObj);
};
