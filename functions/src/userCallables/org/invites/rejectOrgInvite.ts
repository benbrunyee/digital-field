import * as firebase from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { info } from 'firebase-functions/logger';
import { HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { app } from '../../..';
import { getOrgDoc } from '../../../util/getOrgDoc';
import { getUserDoc } from '../../../util/getUserDoc';
import { AuthenticatedCallableRequest } from '../../../util/withAuth';

const firestore = getFirestore(app);

const rejectOrgInviteSchema = z.object({
	orgId: z.string()
});
export type RejectOrgInviteData = z.infer<typeof rejectOrgInviteSchema>;

export const rejectOrgInviteFn = async (
	request: AuthenticatedCallableRequest<RejectOrgInviteData>
) => {
	let data: RejectOrgInviteData | undefined;

	// Validate and extract data
	try {
		data = rejectOrgInviteSchema.parse(request.data);
	} catch (error) {
		throw new HttpsError('invalid-argument', "Data didn't match schema", error);
	}

	const orgId = data.orgId;
	const uid = request.auth.uid;

	const userDoc = await getUserDoc(uid);

	if (!userDoc) {
		throw new HttpsError('not-found', 'User does not exist');
	}

	const orgDoc = await getOrgDoc(orgId);

	if (!orgDoc) {
		info(
			"Org doesn't exist (maybe deleted?), so we don't need to remove the invite from the org doc"
		);
	}

	// Check if user has been invited to org
	const orgInvites = userDoc.data()?.orgInvites ?? [];

	if (!orgInvites[orgId]) {
		throw new HttpsError('not-found', 'User has not been invited to this org');
	}

	// Add user to org
	await removeOrgInvite(uid, orgId, {
		// Only update org if it exists (if it doesn't exist, it's probably been deleted and we don't need to update it)s
		updateOrg: Boolean(orgDoc)
	});
};

const removeOrgInvite = (uid: string, orgId: string, { updateOrg = true }) => {
	// TODO: Batch this
	const userRef = firestore.collection('users').doc(uid);
	const userPromise = userRef.update(`orgInvites.${orgId}`, firebase.firestore.FieldValue.delete());

	if (!updateOrg) {
		return userPromise;
	}

	const orgRef = firestore.collection('org').doc(orgId);
	const orgPromise = orgRef.update(`memberInvites.${uid}`, firebase.firestore.FieldValue.delete());

	return Promise.all([orgPromise, userPromise]);
};
