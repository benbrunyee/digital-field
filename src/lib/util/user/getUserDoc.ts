import { auth, firestore } from '$lib/firebase';
import { userSchema, type User } from '$lib/util/user/types/user';
import { doc, getDoc } from 'firebase/firestore';

export const getUserDoc = async () => {
	if (!auth.currentUser) throw new Error('Not logged in');

	const userDoc = await getDoc(doc(firestore, `users/${auth.currentUser.uid}`));

	const userData: User = userSchema.parse(userDoc.data());

	return userData;
};
