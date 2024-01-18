import { getFirestore } from 'firebase-admin/firestore';
import { app } from '..';

const firestore = getFirestore(app);

export const getOrgDoc = async (orgId: string) => {
	const orgRef = await firestore.collection('org').doc(orgId).get();

	if (!orgRef.exists) {
		return null;
	}

	return orgRef;
};
