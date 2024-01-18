import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';

export const onFormUpdateFn = (
	event: FirestoreEvent<
		Change<QueryDocumentSnapshot> | undefined,
		{
			formId: string;
		}
	>
) => {
	if (event.data) {
		// Check if last updated is more than 5 seconds ago
		const lastUpdated = event.data.after.get('updatedAt');

		if (lastUpdated) {
			const lastUpdatedDate = new Date(lastUpdated.toDate());
			const currentDate = new Date();
			const diff = currentDate.getTime() - lastUpdatedDate.getTime();
			const seconds = diff / 1000;
			if (seconds < 5) {
				return;
			}
		}

		const updateDate = new Date();
		event.data.after.ref.set({ updatedAt: updateDate }, { merge: true });
	}
};
