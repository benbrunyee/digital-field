import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { addId } from '../../util/addId';
import { createId } from '../../util/createId';
import { updateTimestamp } from '../../util/updateTimestamps';

export const onFormCreateFn = (
	event: FirestoreEvent<
		QueryDocumentSnapshot | undefined,
		{
			formId: string;
		}
	>
): void => {
	if (!event.data) {
		return;
	}

	updateTimestamp(event, {
		includeCreatedAt: true
	});

	// Update all the fields without an id to have an id
	const fields = event.data.data().fields;

	if (fields && fields instanceof Array && fields.length > 0) {
		const updatedFields = fields.map((field: any) => {
			if (!field.type) {
				throw new Error('Field type is required');
			}

			if (!field.id) {
				return { ...field, id: createId(field.type) };
			}

			return field;
		});

		event.data.ref.set({ fields: updatedFields }, { merge: true });
	}

	addId(event);
};
