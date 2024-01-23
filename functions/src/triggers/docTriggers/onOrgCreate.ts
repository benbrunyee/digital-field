import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { addId } from '../../util/addId';

export const onOrgCreateFn = (
	event: FirestoreEvent<
		QueryDocumentSnapshot | undefined,
		{
			orgId: string;
		}
	>
) => {
	if (event.data) {
		const creationDate = new Date();
		event.data?.ref.set({ createdAt: creationDate, updatedAt: creationDate }, { merge: true });
	}

	addId(event);
};
