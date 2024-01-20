import { goto } from '$app/navigation';
import { orgIdStore } from '../../stores/org';
import { userStore } from './stores/userStore';
import { createEmptyUserObject } from './types/createUser';

export const onSignOut = () => {
	localStorage.clear();
	userStore.set(createEmptyUserObject());
	orgIdStore.set('');
	console.log('Redirecting');
	goto('/app/sign-in');
};
