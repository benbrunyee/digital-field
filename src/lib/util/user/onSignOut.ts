import { goto } from '$app/navigation';
import { orgIdStore } from '../../stores/org';
import { userStore } from './stores/userStore';
import { createEmptyUserObject } from './types/createUser';

export const onSignOut = async () => {
	orgIdStore.set('');
	userStore.set(createEmptyUserObject());
	console.log('Redirecting');
	await goto('/app/sign-in');
};
