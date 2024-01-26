import type { User } from '$lib/util/user/types/user';
import { Timestamp } from 'firebase/firestore';
import { writable } from 'svelte/store';

export const userStore = writable<User>({
	email: '',
	id: '',
	name: '',
	orgInvites: {},
	orgs: {},
	primaryOrgId: '',
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now()
});
