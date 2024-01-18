import { UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import { z } from 'zod';

const firestore = getFirestore();

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
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

export const onUserCreateFn = async (
	user: UserRecord,
	context: functions.EventContext<Record<string, string>>
) => {
	const userRef = firestore.doc(`users/${user.uid}`);

	const date = new Date();

	const userObj: User = {
		id: user.uid,
		email: user.email ?? '',
		createdAt: date,
		updatedAt: date,
		orgInvites: {},
		orgs: {}
	};

	await userRef.set(userObj);
};
