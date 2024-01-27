import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { debug, log } from 'firebase-functions/logger';
import { Change, FirestoreEvent } from 'firebase-functions/v2/firestore';
import { createId } from '../../util/createId';
import { createTimestamps } from '../../util/createTimestamps';

export const onFormUpdateFn = (
	event: FirestoreEvent<
		Change<QueryDocumentSnapshot> | undefined,
		{
			formId: string;
		}
	>
) => {
	let changesMade = false;

	if (!event.data) {
		return;
	}

	const updatedDocObj: any = {};

	const timestamps = createTimestamps(event);

	// Undefined if the timestamps are the same
	if (timestamps) {
		changesMade = true;
		updatedDocObj.updatedAt = timestamps.updatedAt;
	}

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
		changesMade = true;
		updatedDocObj.fields = updatedFields;
	}

	if (!changesMade) {
		return event.data.after.ref.update(updatedDocObj);
	}

	return;
};
