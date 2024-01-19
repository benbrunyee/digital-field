import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { createId } from '../../util/createId';

export const onFormUpdateFn = (
	event: FirestoreEvent<
		Change<QueryDocumentSnapshot> | undefined,
		{
			formId: string;
		}
	>
): void => {
	if (!event.data) {
		return;
	}

	// Update the updatedAt field
	if (event.data.before.data().updatedAt !== event.data.after.data().updatedAt) {
		event.data.after.ref.set({ updatedAt: event.data.after.updateTime }, { merge: true });
	}

	// Update all the fields without an id to have an id
	const fields = event.data.after.data().fields;

	if (fields && fields instanceof Array && fields.length > 0) {
		const updatedFields = fields.map((field: any) => {
			if (!field.type) {
				throw new Error('Field type is required');
			}

			if (!field.id) {
				return { ...field, id: createId(`${field.type}-`) };
			}

			return field;
		});

		event.data.after.ref.set({ fields: updatedFields }, { merge: true });
	}
};
