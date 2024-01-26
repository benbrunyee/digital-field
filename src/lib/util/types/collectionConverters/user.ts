import { userSchema } from '../../user/types/user';

export const parseUser = (user: any) => {
	return userSchema.parse(user);
};
