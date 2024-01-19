import * as admin from 'firebase-admin';

admin.initializeApp();

import * as functions from 'firebase-functions';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { CallableOptions, onCall } from 'firebase-functions/v2/https';
import { createUserRolesFn } from './development/createUserRoles';
import { beforeSignInFn } from './triggers/beforeUserSignIn';
import { onFormCreateFn } from './triggers/docTriggers/onFormCreate';
import { onFormUpdateFn } from './triggers/docTriggers/onFormUpdate';
import { onOrgCreateFn } from './triggers/docTriggers/onOrgCreate';
import { onOrgUpdateFn } from './triggers/docTriggers/onOrgUpdate';
import { onUserCreateFn } from './triggers/onUserCreate';
import { createAndJoinOrgFn } from './userCallables/org/createAndJoinOrg';
import { acceptOrgInviteFn } from './userCallables/org/invites/acceptOrgInvite';
import { sendOrgInviteFn } from './userCallables/org/invites/sendOrgInvite';
import { updateUserDetailsFn } from './userCallables/user/updateUserDetails';
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
export const onOrgCreate = onDocumentCreated('org/{orgId}', onOrgCreateFn);
export const onOrgUpdate = onDocumentUpdated('org/{orgId}', onOrgUpdateFn);

// Form triggers
export const onFormCreate = onDocumentCreated('forms/{formId}', onFormCreateFn);
export const onFormUpdate = onDocumentUpdated('forms/{formId}', onFormUpdateFn);

// Other triggers

export const onUserCreate = functions.auth.user().onCreate(onUserCreateFn);
export const onUserUpdate = functions.auth.user().beforeSignIn(beforeSignInFn);
