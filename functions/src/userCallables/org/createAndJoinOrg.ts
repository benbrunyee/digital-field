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

	return await firestore.runTransaction(async (transaction) => {
		const userSnap = await transaction.get(firestore.collection(USER_COLLECTION).doc(uid));
		const userData = userSnap.data();

		if (!(userSnap.exists && userData)) {
			return Promise.reject('User does not exist');
		}

		if (userData.orgId) {
			return Promise.reject('User is already in an org');
		}

		const orgRef = firestore.collection(ORG_COLLECTION).doc();

		transaction.create(orgRef, {
			name: orgName,
			members: {
				[uid]: true
			}
		});
		transaction.update(userSnap.ref, { orgId: orgRef.id });

		return true;
	});
};
