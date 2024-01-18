import { auth, firestore } from '$lib/firebase';
import { userSchema, type User } from '$lib/util/user/types/user';
import { doc, getDoc } from 'firebase/firestore';
import { isFirestoreTimestamp } from '../types/isFirestoreTimestamp';

export const getUserDoc = async () => {
	if (!auth.currentUser) throw new Error('Not logged in');

	const userDoc = await getDoc(doc(firestore, `users/${auth.currentUser.uid}`));

	const userData = userDoc.data();

	const dateFields: (keyof Partial<User>)[] = ['createdAt', 'updatedAt'];

	for (let key of dateFields) {
		const value = userData?.[key];

		if (value && isFirestoreTimestamp(value)) {
			userData[key] = value.toDate();
		}
	}

	const userParsedData: User = userSchema.parse(userData);
	return userParsedData;
};
