import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { getOrgDoc } from '../../../util/getOrgDoc';
import { getUserDoc } from '../../../util/getUserDoc';
import { AuthenticatedCallableRequest } from '../../../util/middleware/withAuth';
import { ORG_COLLECTION, USER_COLLECTION } from '../../../util/types/collections';

const firestore = getFirestore();

const acceptOrgInviteSchema = z.object({
	orgId: z.string()
});
export type AcceptOrgInviteData = z.infer<typeof acceptOrgInviteSchema>;

export const acceptOrgInviteFn = async (
	request: AuthenticatedCallableRequest<AcceptOrgInviteData>
) => {
	let data: AcceptOrgInviteData | undefined;

	// Validate and extract data
	try {
		data = acceptOrgInviteSchema.parse(request.data);
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
		throw new HttpsError('not-found', 'Org does not exist');
	}

	// Check if user has been invited to org
	const orgInvites = userDoc.data()?.orgInvites ?? [];

	if (!orgInvites[orgId]) {
		throw new HttpsError('not-found', 'User has not been invited to this org');
	}

	// Add user to org
	await addUserToOrg(uid, orgId);
};

const addUserToOrg = async (uid: string, orgId: string) => {
	return await firestore.runTransaction(async (transaction) => {
		const orgSnap = await transaction.get(firestore.collection(ORG_COLLECTION).doc(orgId));
		const userSnap = await transaction.get(firestore.collection(USER_COLLECTION).doc(uid));

		const orgData = orgSnap.data();
		const userData = userSnap.data();

		if (!(orgSnap.exists && orgData)) {
			return Promise.reject('Org does not exist');
		}

		if (!(userSnap.exists && userData)) {
			return Promise.reject('User does not exist');
		}

		if (orgSnap.data()?.members?.[uid]) {
			return Promise.reject('User is already a member of this org');
		}

		if (!userSnap.data()?.orgInvites?.[orgId]) {
			return Promise.reject('User has not been invited to this org');
		}

		transaction.update(orgSnap.ref, `members.${uid}`, true);
		transaction.update(userSnap.ref, `orgs.${orgId}`, { orgId, role: 'viewer' });

		return true;
	});
};
