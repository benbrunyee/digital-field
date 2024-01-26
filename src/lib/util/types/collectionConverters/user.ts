import type { DocumentData } from 'firebase/firestore';
import { userSchema, type User } from '../../user/types/user';

export const parseUser = (user: DocumentData): User => {
	return userSchema.parse(user);
};
