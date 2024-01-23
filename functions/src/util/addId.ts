import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';

export const addId = (event: FirestoreEvent<QueryDocumentSnapshot | undefined, any>) => {
	if (!event.data) {
		return;
	}
	event.data.ref.set({ id: event.id }, { merge: true });
};
