import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { CallableOptions, HttpsError, onCall } from 'firebase-functions/v2/https';

const secureOptions: CallableOptions = {
	enforceAppCheck: true
};

// Callable functions

export const acceptOrgInvite = onCall(secureOptions, async (request) => {
	const orgId = request.data.orgId;
	const uid = request.auth?.uid;

	if (!uid) {
		throw new HttpsError('permission-denied', 'User needs to be logged in');
	}

	if (!orgId) {
		throw new HttpsError('invalid-argument', 'orgId is required');
	}
});

// Document triggers

export const onOrgCreation = onDocumentCreated('org/{orgId}', (event) => {
	if (event.data) {
		const creationDate = new Date();
		event.data?.ref.set({ createdAt: creationDate, updatedAt: creationDate }, { merge: true });
	}
});

export const onOrgUpdate = onDocumentUpdated('org/{orgId}', (event) => {
	if (event.data) {
		const updateDate = new Date();
		event.data.after.ref.set({ updatedAt: updateDate }, { merge: true });
	}
});
