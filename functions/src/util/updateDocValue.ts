import { getFirestore } from 'firebase-admin/firestore';

const firestore = getFirestore();

export const updateDocValue = async (path: string, key: string, value: any) => {
	const docRef = firestore.doc(path);

	const doc = await docRef.get();
	const docData = doc.data();

	if (!doc.exists || !docData) {
		throw new Error(`Document does not exist at path ${path}`);
	}

	docRef.update(key, value);
};
