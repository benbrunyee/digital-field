import * as admin from 'firebase-admin';

admin.initializeApp();

import * as functions from 'firebase-functions';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { onUserCreateFn } from './triggers/onUserCreate';
import { createAndJoinOrgFn } from './userCallables/createAndJoinOrg';
import { acceptOrgInviteFn } from './userCallables/org/invites/acceptOrgInvite';
import { sendOrgInviteFn } from './userCallables/org/invites/sendOrgInvite';
import { withAuth } from './util/withAuth';

export const secureOptions: CallableOptions = {
	enforceAppCheck: true
};

// Callable functions

export const acceptOrgInvite = onCall(secureOptions, withAuth(acceptOrgInviteFn));
export const sendOrgInvite = onCall(secureOptions, withAuth(sendOrgInviteFn));
export const createAndJoinOrg = onCall(secureOptions, withAuth(createAndJoinOrgFn));

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

// Other triggers

export const onUserCreate = functions.auth.user().onCreate(onUserCreateFn);
