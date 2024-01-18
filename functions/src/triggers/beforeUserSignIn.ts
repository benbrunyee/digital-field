import { getFirestore } from 'firebase-admin/firestore';
import { AuthEventContext, AuthUserRecord } from 'firebase-functions/lib/common/providers/identity';
import { log } from 'firebase-functions/logger';
import { createUserDoc } from '../util/createUserDoc';
import { USER_COLLECTION } from '../util/types/collections';

const firestore = getFirestore();

export const beforeSignInFn = async (user: AuthUserRecord, context: AuthEventContext) => {
	// Ensure that the document exists
	const uid = context.auth?.uid;

	if (!uid) {
		throw new Error('User is not authenticated');
	}

	const { email, displayName } = user;

	const userDoc = await firestore.collection(USER_COLLECTION).doc(uid).get();
	const userData = userDoc.data();

	if (!userDoc.exists || !userData) {
		createUserDoc(uid, email ?? '', displayName ?? '');
		return;
	}

	if (userData.displayName !== displayName) {
		log(`Updating display name for ${uid}`);
		await userDoc.ref.update({
			displayName
		});
	}

	if (userData.email !== email) {
		log(`Updating email for ${uid}`);
		await userDoc.ref.update({
			email
		});
	}
};
