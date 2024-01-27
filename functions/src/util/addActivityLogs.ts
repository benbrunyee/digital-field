import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v1/auth';
import { FORM_COLLECTION } from './types/collections';

type ActivityLogAction = 'created-entry' | 'updated-entry' | 'deleted-entry';

type ActivityLogDetails = {
	createdAt: Timestamp;
	title: string;
	authorId: string;
	authorName?: string;
	count?: number;
	formName?: string;
};

type ActivityLog = {
	title: string;
	details: string;
	createdAt: Timestamp;
};

const firestore = getFirestore();

export const addActivityLog = async (
	formId: string,
	action: ActivityLogAction,
	details: ActivityLogDetails
) => {
	let formName = details.formName ?? '';
	let authorName = details.authorName ?? '';

	if (!details.formName) {
		const form = await firestore.collection(FORM_COLLECTION).doc(formId).get();
		formName = form.data()?.name;
	}

	if (!formName) {
		throw new HttpsError('not-found', 'Form not found');
	}

	if (!details.authorName) {
		const author = await firestore.collection('users').doc(details.authorId).get();
		authorName = author.data()?.name;
	}

	if (!authorName) {
		throw new HttpsError('not-found', 'Author not found');
	}

	const activityLog: ActivityLog = {
		title: details.title,
		createdAt: details.createdAt,
		details: createActivityLogDetail(action, {
			...details,
			formName,
			authorName
		})
	};

	return await firestore
		.collection(FORM_COLLECTION)
		.doc(formId)
		.collection('activityLogs')
		.add(activityLog);
};

const createActivityLogDetail = (action: ActivityLogAction, details: ActivityLogDetails) => {
	let string = details.authorName + ' ';

	switch (action) {
		case 'created-entry':
			if (details.count) {
				string = `created ${details.count} entries`;
			} else {
				string = `created an entry`;
			}
			break;
		case 'updated-entry':
			if (details.count) {
				string = `updated ${details.count} entries`;
			} else {
				string = `updated an entry`;
			}
			break;
		case 'deleted-entry':
			if (details.count) {
				string = `deleted ${details.count} entries`;
			} else {
				string = `deleted an entry`;
			}
			break;
		default:
			throw new HttpsError('unimplemented', `Action not implemented: ${action}`);
	}

	return string;
};
