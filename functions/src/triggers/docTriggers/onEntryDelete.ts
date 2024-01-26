import { DocumentSnapshot } from 'firebase-admin/firestore';
import { warn } from 'firebase-functions/logger';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { alterFormRecordCount } from '../../util/alterFormRecordCount';

export const onEntryDeleteFn = async (event: FirestoreEvent<DocumentSnapshot | undefined>) => {
	if (!event.data) {
		return;
	}

	const formId = event.data.ref.parent?.parent?.id;

	if (!formId) {
		warn(
			`Entry with id ${event.data.ref.id} does not have a parent form id, could not decrement record count. This could happen if the parent form was deleted.`
		);
		return;
	}

	// Decrement the record count of the form
	await alterFormRecordCount(formId, 'decrement');
};
