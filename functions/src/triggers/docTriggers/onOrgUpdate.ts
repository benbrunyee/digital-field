import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';

export const onOrgUpdateFn = (
	event: FirestoreEvent<
		Change<QueryDocumentSnapshot> | undefined,
		{
			orgId: string;
		}
	>
) => {
	if (event.data) {
		const updateDate = new Date();
		event.data.after.ref.set({ updatedAt: updateDate }, { merge: true });
	}
};
