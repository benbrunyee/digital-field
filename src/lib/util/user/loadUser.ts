import { auth } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { USER_COLLECTION } from '../types/collections';

export const getUserDoc = async () => {
	if (!auth.currentUser) throw new Error('Not logged in');

	const userDoc = await getDoc(doc(USER_COLLECTION, auth.currentUser.uid));

	return userDoc.data();
};
