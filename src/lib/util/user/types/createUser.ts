import type { User } from './user';

export const createEmptyUserObject = (): User => ({
	id: '',
	email: '',
	name: '',
	updatedAt: new Date(),
	createdAt: new Date(),
	orgInvites: {},
	orgs: {},
	primaryOrgId: ''
});
