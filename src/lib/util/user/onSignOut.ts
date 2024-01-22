import { goto } from '$app/navigation';
import { orgIdStore } from '../../stores/org';
import { userStore } from './stores/userStore';
import { createEmptyUserObject } from './types/createUser';

export const onSignOut = () => {
	orgIdStore.set('');
	userStore.set(createEmptyUserObject());
	console.log('Redirecting');
	goto('/app/sign-in');
};
