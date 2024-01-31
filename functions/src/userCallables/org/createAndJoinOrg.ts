import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { AuthenticatedCallableRequest } from '../../util/middleware/withAuth';
import { ORG_COLLECTION, USER_COLLECTION } from '../../util/types/collections';

const firestore = getFirestore();

export const createAndJoinOrgFn = async (request: AuthenticatedCallableRequest) => {
	const orgName = request.data.orgName;
	const uid = request.auth.uid;

	if (!(orgName && typeof orgName === 'string')) {
		throw new HttpsError('invalid-argument', 'orgName is required');
	}

	// Check if user is already in an org
	// If so, throw an error
	const userDoc = await firestore.collection(USER_COLLECTION).doc(uid).get();
	const userData = userDoc.data();

	if (userData?.orgId) {
		throw new HttpsError('already-exists', 'User is already in an org');
	}

	// TODO: Batch this

	// Create org
	const orgDoc = await firestore.collection(ORG_COLLECTION).add({
		name: orgName,
		members: {
			[uid]: true
		}
	});

	// Update user
	await userDoc.ref.update({ orgId: orgDoc.id });
};
