import * as admin from 'firebase-admin';

admin.initializeApp();

import * as functions from 'firebase-functions';
import {
	onDocumentCreated,
	onDocumentDeleted,
	onDocumentUpdated
} from 'firebase-functions/v2/firestore';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { createUserRolesFn } from './development/createUserRoles';
import { beforeSignInFn } from './triggers/beforeUserSignIn';
import { onEntryCreateFn } from './triggers/docTriggers/onEntryCreate';
import { onEntryDeleteFn } from './triggers/docTriggers/onEntryDelete';
import { onFormCreateFn } from './triggers/docTriggers/onFormCreate';
import { onFormDeleteFn } from './triggers/docTriggers/onFormDelete';
import { onFormUpdateFn } from './triggers/docTriggers/onFormUpdate';
import { onOrgCreateFn } from './triggers/docTriggers/onOrgCreate';
import { onOrgUpdateFn } from './triggers/docTriggers/onOrgUpdate';
import { onUserCreateFn } from './triggers/onUserCreate';
import { createAndJoinOrgFn } from './userCallables/org/createAndJoinOrg';
import { acceptOrgInviteFn } from './userCallables/org/invites/acceptOrgInvite';
import { sendOrgInviteFn } from './userCallables/org/invites/sendOrgInvite';
import { updateUserDetailsFn } from './userCallables/user/updateUserDetails';
import { ENTRY_COLLECTION, FORM_COLLECTION, ORG_COLLECTION } from './util/types/collections';
import { withAuth } from './util/withAuth';

export const secureOptions: CallableOptions = {
	enforceAppCheck: true
};

// Dev callables

export const createUserRoles = onCall(createUserRolesFn);

// Callable functions

export const acceptOrgInvite = onCall(secureOptions, withAuth(acceptOrgInviteFn));
export const sendOrgInvite = onCall(secureOptions, withAuth(sendOrgInviteFn));
export const createAndJoinOrg = onCall(secureOptions, withAuth(createAndJoinOrgFn));
export const updateUserDetails = onCall(secureOptions, withAuth(updateUserDetailsFn));

// Document triggers

// Org triggers
export const onOrgCreate = onDocumentCreated(`${ORG_COLLECTION}/{orgId}`, onOrgCreateFn);
export const onOrgUpdate = onDocumentUpdated(`${ORG_COLLECTION}/{orgId}`, onOrgUpdateFn);

// Form triggers
export const onFormCreate = onDocumentCreated(`${FORM_COLLECTION}/{formId}`, onFormCreateFn);
export const onFormUpdate = onDocumentUpdated(`${FORM_COLLECTION}/{formId}`, onFormUpdateFn);
export const onFormDelete = onDocumentDeleted(`${FORM_COLLECTION}/{formId}`, onFormDeleteFn);

// Record triggers
export const onEntryCreate = onDocumentCreated(
	`${FORM_COLLECTION}/{formId}/${ENTRY_COLLECTION}/{entryId}`,
	onEntryCreateFn
);
export const onEntryDelete = onDocumentDeleted(
	`${FORM_COLLECTION}/{formId}/${ENTRY_COLLECTION}/{entryId}`,
	onEntryDeleteFn
);

// Other triggers

export const onUserCreate = functions.auth.user().onCreate(onUserCreateFn);
export const onUserUpdate = functions.auth.user().beforeSignIn(beforeSignInFn);
