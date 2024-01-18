import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { getUserDocByEmail } from '../../../util/getUserDoc';
import { USER_COLLECTION } from '../../../util/types/collections';
import { AuthenticatedCallableRequest } from '../../../util/withAuth';

const firestore = getFirestore();

export const sendOrgInviteFn = async (request: AuthenticatedCallableRequest) => {
	const targetEmail = request.data.targetEmail;
	const orgId = request.data.orgId;

	if (!(targetEmail && typeof targetEmail === 'string')) {
		throw new HttpsError('invalid-argument', 'targetEmail is required');
	}

	if (!(orgId && typeof orgId === 'string')) {
		throw new HttpsError('invalid-argument', 'orgId is required');
	}

	// Check if user exists
	const userDoc = await getUserDocByEmail(targetEmail);

	if (!userDoc) {
		// Create user
		await createUserWithInvite(targetEmail, orgId);
		return;
	} else {
		// Add invite to user
		await addInviteToUser(userDoc.id, orgId);
	}
};

const createUserWithInvite = async (email: string, orgId: string) => {
	const userRef = await firestore.collection(USER_COLLECTION).add({
		email,
		orgInvites: { [orgId]: true }
	});
	return userRef.id;
};

const addInviteToUser = async (uid: string, orgId: string) => {
	const userRef = await firestore.collection(USER_COLLECTION).doc(uid);
	return userRef.update({ orgInvites: { [orgId]: true } });
};
