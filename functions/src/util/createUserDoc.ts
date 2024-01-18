import { getFirestore } from 'firebase-admin/firestore';
import { log } from 'firebase-functions/logger';
import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	orgInvites: z.record(
		z.string(),
		z.object({
			id: z.string(),
			role: z.string()
		})
	),
	orgs: z.record(
		z.string(),
		z.object({
			id: z.string(),
			role: z.string()
		})
	)
});
export type User = z.infer<typeof userSchema>;
const firestore = getFirestore();
export const createUserDoc = async (uid: string, email: string, name: string) => {
	log(`Creating user doc for ${uid}`);

	const userRef = firestore.doc(`users/${uid}`);

	const date = new Date();

	const userObj: User = {
		id: uid,
		email,
		name,
		createdAt: date,
		updatedAt: date,
		orgInvites: {},
		orgs: {}
	};

	return await userRef.set(userObj);
};
