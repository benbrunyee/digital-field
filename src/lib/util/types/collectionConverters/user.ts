import { userSchema, type User } from '../../user/types/user';
import { convertFirestoreTimestamps } from '../convertFirestoreTimestamp';

export const parseUser = (user: any) => {
	const dateFields: (keyof Partial<User>)[] = ['createdAt', 'updatedAt'];
	return userSchema.parse(convertFirestoreTimestamps(user, dateFields));
};
