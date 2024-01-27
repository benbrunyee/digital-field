import { goto } from '$app/navigation';
import { getOrg } from '../org/loadOrg';
import { getUserDoc } from './loadUser';
import { userStore } from './stores/userStore';

export const onSignIn = async () => {
	const userData = await getUserDoc();

	if (!userData) {
		console.error('User data is undefined');
		goto('/app/sign-in');
		return;
	}

	userStore.set(userData);

	// Check if the org exists with a name
	// If not then redirect to the second step on the sign-in page
	// so that the user can set the org name
	const orgData = await getOrg(userData.primaryOrgId);

	if (!orgData?.name) {
		goto('/app/sign-in?step=2');
		return;
	}

	goto(`/app/org/${userData.primaryOrgId}`);
};
