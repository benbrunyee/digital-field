import { Timestamp } from 'firebase/firestore';
import type { User } from './user';

export const createEmptyUserObject = (): User => ({
	id: '',
	email: '',
	name: '',
	updatedAt: Timestamp.now(),
	createdAt: Timestamp.now(),
	orgInvites: {},
	orgs: {},
	primaryOrgId: ''
});
