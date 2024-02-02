import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirestoreEvent } from 'firebase-functions/v2/firestore';
import { createId } from '../../util/createId';
import { createTimestamps } from '../../util/createTimestamps';

export const onFormCreateFn = (
	event: FirestoreEvent<
		QueryDocumentSnapshot | undefined,
		{
			formId: string;
		}
	>
) => {
	if (!event.data) {
		return;
	}

	const updateDocObj: any = {
		id: event.data.ref.id,
		entryCount: 0
	};

	const timestamps = createTimestamps(event, {
		includeCreatedAt: true
	});

	if (timestamps) {
		updateDocObj.updatedAt = timestamps.updatedAt;

		if (timestamps.createdAt) {
			updateDocObj.createdAt = timestamps.createdAt;
		}
	}

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

		updateDocObj.fields = updatedFields;
	}

	return event.data.ref.update(updateDocObj);
};
