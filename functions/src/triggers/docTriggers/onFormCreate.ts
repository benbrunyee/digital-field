import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';

export const onFormCreateFn = (
	event: FirestoreEvent<
		QueryDocumentSnapshot | undefined,
		{
			formId: string;
		}
	>
) => {
	if (event.data) {
		const updateDate = new Date();
		return event.data.ref.set({ updatedAt: updateDate, createdAt: updateDate }, { merge: true });
	}

	return null;
};
