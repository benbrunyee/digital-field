import type { User } from '$lib/util/user/types/user';
import { writable } from 'svelte/store';

export const userStore = writable<User>({
	email: '',
	id: '',
	name: '',
	orgInvites: {},
	orgs: {},
	primaryOrgId: '',
	createdAt: new Date(),
	updatedAt: new Date()
});
