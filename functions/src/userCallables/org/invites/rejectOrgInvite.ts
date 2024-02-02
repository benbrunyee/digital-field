import * as firebase from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { info, warn } from 'firebase-functions/logger';
import { HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { getOrgDoc } from '../../../util/getOrgDoc';
import { getUserDoc } from '../../../util/getUserDoc';
import { AuthenticatedCallableRequest } from '../../../util/middleware/withAuth';
import { ORG_COLLECTION, USER_COLLECTION } from '../../../util/types/collections';

const firestore = getFirestore();

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
	await removeOrgInvite(uid, orgId);
};

const removeOrgInvite = async (uid: string, orgId: string) => {
	return await firestore.runTransaction(async (transaction) => {
		const userSnap = await transaction.get(firestore.collection(USER_COLLECTION).doc(uid));
		const orgSnap = await transaction.get(firestore.collection(ORG_COLLECTION).doc(orgId));

		const userData = userSnap.data();
		const orgData = orgSnap.data();

		if (!(userSnap.exists && userData)) {
			// This can happen if the user had deleted their account before the invite was responded to
			warn('User does not exist');
		}

		if (!(orgSnap.exists && orgData)) {
			// This can happen if the org has been deleted before the invite was responded to
			warn('Org does not exist');
		}

		if (orgData?.members?.[uid]) {
			warn('User is already a member of this org');
		}

		if (userSnap.exists) {
			transaction.update(
				userSnap.ref,
				`orgInvites.${orgId}`,
				firebase.firestore.FieldValue.delete()
			);
		}

		if (orgSnap.exists) {
			transaction.update(
				orgSnap.ref,
				`memberInvites.${uid}`,
				firebase.firestore.FieldValue.delete()
			);
		}

		if (!(userData?.orgInvites?.[orgId] && orgData?.memberInvites?.[uid])) {
			return Promise.reject('User has not been invited to this org');
		}

		return true;
	});
};
