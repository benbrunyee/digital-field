import { getFirestore } from 'firebase-admin/firestore';
import { CallableRequest } from 'firebase-functions/v2/https';
import { userRoles } from '../util/types/userRoles';

const firestore = getFirestore();

export const createUserRolesFn = async (request: CallableRequest) => {
	const promises = [];

	for (const [role, permissions] of Object.entries(userRoles)) {
		promises.push(
			firestore
				.collection('userRoles')
				.doc(role)
				.set({
					permissions: permissions.reduce<{ [k: string]: boolean }>((r, perm) => {
						r[perm] = true;
						return r;
					}, {})
				})
		);
	}

	await Promise.all(promises);
};
