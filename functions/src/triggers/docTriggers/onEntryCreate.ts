import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { error } from 'firebase-functions/logger';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { alterFormRecordCount } from '../../util/alterFormRecordCount';
import { createTimestamps } from '../../util/createTimestamps';

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
	}

	// Update the record count of the form
	await alterFormRecordCount(formId, 'increment');

	return event.data.ref.update(updatedDocObj);
};
