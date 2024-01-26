import { doc, getDoc } from 'firebase/firestore';
import { type Org } from '../../OrgCreator/types/orgType';
import { auth } from '../../firebase';
import { ORG_COLLECTION } from '../types/collections';

export const getOrg = async (id: string): Promise<Org | undefined> => {
	if (!auth.currentUser) {
		throw new Error('User not logged in');
	}

	const orgDoc = await getDoc(doc(ORG_COLLECTION, id));

	return orgDoc.data();
};
