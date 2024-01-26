import { auth, firestore } from '$lib/firebase';
import { userSchema } from '$lib/util/user/types/user';
import { doc, getDoc } from 'firebase/firestore';

export const getUserDoc = async () => {
	if (!auth.currentUser) throw new Error('Not logged in');

	const userDoc = await getDoc(doc(firestore, `users/${auth.currentUser.uid}`));

	return userSchema.parse(userDoc.data());
};
