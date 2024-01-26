import { CollectionReference, DocumentReference, getFirestore } from 'firebase-admin/firestore';

const firestore = getFirestore();

export const batchDeleteCollection = async (
	collectionRef: CollectionReference,
	batchSize = 500
) => {
	return collectionRef.listDocuments().then((docs) => {
		const batches = [];

		while (docs.length > 0) {
			batches.push(docs.splice(0, batchSize));
		}

		return Promise.all(batches.map((batch) => deleteQueryBatch(batch)));
	});
};

export const deleteQueryBatch = (batch: DocumentReference[]) => {
	const writeBatch = firestore.batch();

	batch.forEach((doc) => {
		writeBatch.delete(doc);
	});

	return writeBatch.commit();
};
