import { goto } from '$app/navigation';
import { getUserDoc } from './getUserDoc';
import { userStore } from './stores/userStore';

export const onSignIn = async () => {
	const userData = await getUserDoc();
	userStore.set(userData);
	goto(`/app/org/${userData.primaryOrgId}`);
};
