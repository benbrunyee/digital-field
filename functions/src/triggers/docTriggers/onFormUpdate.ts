import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { debug, log } from 'firebase-functions/logger';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { createId } from '../../util/createId';
import { updateTimestamp } from '../../util/updateTimestamps';

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

	updateTimestamp(event);

	// Update all the fields without an id to have an id
	const fields = event.data.after.data().fields;

	if (
		fields &&
		fields instanceof Array &&
		fields.length > 0 &&
		fields.find((field: any) => !field.id)
	) {
		const updatedFields = fields.map((field: any) => {
			if (!field.type) {
				throw new Error('Field type is required');
			}

			if (!field.id) {
				debug('Creating id for field', field);
				return { ...field, id: createId(field.type) };
			}

			return field;
		});

		log('Updating fields', updatedFields);
		event.data.after.ref.set({ fields: updatedFields }, { merge: true });
	}
};
