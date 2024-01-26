import { error, log } from 'firebase-functions/logger';
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { batchDeleteCollection } from '../../util/batchDeleteCollection';

export const onFormDeleteFn = async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
	if (!event.data) {
		error('Form deleted with no data');
		return;
	}

	// Delete all the form entries
	log('Deleting all entries for form', event.data.ref.path);
	await batchDeleteCollection(event.data.ref.collection('entries'));

	// Delete all the form output entities
	log('Deleting all outputs for form', event.data.ref.path);
	await batchDeleteCollection(event.data.ref.collection('outputs'));
};
