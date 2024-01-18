import { getFirestore } from 'firebase-admin/firestore';

const firestore = getFirestore();

export const getOrgDoc = async (orgId: string) => {
	const orgRef = await firestore.collection('org').doc(orgId).get();

	if (!orgRef.exists) {
		return null;
	}

	return orgRef;
};
