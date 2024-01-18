import { UserRecord } from 'firebase-admin/auth';
import * as functions from 'firebase-functions';
import { createUserDoc } from '../util/createUserDoc';

export const onUserCreateFn = async (
	user: UserRecord,
	context: functions.EventContext<Record<string, string>>
) => {
	const { uid, email, displayName } = user;
	await createUserDoc(uid, email ?? '', displayName ?? '');
};
