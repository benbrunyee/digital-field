import { goto } from '$app/navigation';
import { getUserDoc } from './loadUser';
import { userStore } from './stores/userStore';

export const onSignIn = async () => {
	const userData = await getUserDoc();
	userStore.set(userData);
	goto(`/app/org/${userData.primaryOrgId}`);
};
