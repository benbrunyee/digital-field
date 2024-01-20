import { doc, getDoc } from 'firebase/firestore';
import { orgSchema, type Org } from '../../OrgCreator/types/orgType';
import { auth, firestore } from '../../firebase';
import { ORG_COLLECTION } from '../types/collections';
import { isFirestoreTimestamp } from '../types/isFirestoreTimestamp';

export const getOrg = async (id: string) => {
	if (!auth.currentUser) {
		throw new Error('User not logged in');
	}

	const orgDoc = await getDoc(doc(firestore, ORG_COLLECTION, id));

	if (!orgDoc.exists) {
		throw new Error('Org not found');
	}

	const orgData = orgDoc.data();

	if (!orgData) {
		throw new Error('Org not found');
	}

	const dateFields: (keyof Partial<Org>)[] = ['createdAt', 'updatedAt'];

	for (let key of dateFields) {
		const value = orgData?.[key];

		if (value && isFirestoreTimestamp(value)) {
			orgData[key] = value.toDate();
		}
	}

	const orgParsed = orgSchema.parse(orgData);

	return orgParsed;
};
