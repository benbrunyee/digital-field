import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { getOrgDoc } from '../../../util/getOrgDoc';
import { getUserDoc } from '../../../util/getUserDoc';
import { AuthenticatedCallableRequest } from '../../../util/withAuth';

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

const addUserToOrg = (uid: string, orgId: string) => {
	// TODO: Batch this
	const orgRef = firestore.collection('org').doc(orgId);
	const userRef = firestore.collection('users').doc(uid);

	const orgPromise = orgRef.update(`members.${uid}`, true);

	// TODO: Get the role from the invite
	const userPromise = userRef.update(`org.${orgId}`, { orgId, role: 'viewer' });

	return Promise.all([orgPromise, userPromise]);
};
