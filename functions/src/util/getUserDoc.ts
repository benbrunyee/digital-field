import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { USER_COLLECTION } from './types/collections';

const firestore = getFirestore();

export const getUserDoc = async (uid: string) => {
	const userRef = await firestore.collection(USER_COLLECTION).doc(uid).get();

	if (!userRef.exists) {
		return null;
	}

	return userRef;
};

export const getUserDocByEmail = async (email: string) => {
	const userRef = await firestore.collection(USER_COLLECTION).where('email', '==', email).get();

	if (userRef.empty) {
		return null;
	}

	if (userRef.docs.length > 1) {
		throw new HttpsError('internal', 'Multiple users with same email');
	}

	return userRef.docs[0];
};
