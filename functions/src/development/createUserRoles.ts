import { getFirestore } from 'firebase-admin/firestore';
import { CallableRequest } from 'firebase-functions/v2/https';

const firestore = getFirestore();

const userRoles = {
	owner: [
		'deleteOrg',
		'updateOrg',
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',
		'createEntry',
		'deleteEntry',
		'updateEntry',
		'createOutputEntity',
		'updateOutputEntity',
		'deleteOutputEntity',
		'createForm',
		'updateForm',
		'deleteForm'
	],
	orgAdmin: [
		'updateOrg',
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',
		'createEntry',
		'deleteEntry',
		'updateEntry',
		'createOutputEntity',
		'updateOutputEntity',
		'deleteOutputEntity',
		'createForm',
		'updateForm',
		'deleteForm'
	],
	editor: [
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',
		'createEntry',
		'deleteEntry',
		'updateEntry',
		'createOutputEntity',
		'updateOutputEntity',
		'deleteOutputEntity',
		'createForm',
		'updateForm',
		'deleteForm'
	],
	collaborator: [
		'viewOrg',
		'viewOutputEntity',
		'viewEntry',
		'viewForm',
		'createEntry',
		'deleteEntry',
		'updateEntry'
	],
	viewer: ['viewOrg', 'viewOutputEntity', 'viewEntry', 'viewForm']
};

export const createUserRolesFn = async (request: CallableRequest) => {
	for (const [role, permissions] of Object.entries(userRoles)) {
		await firestore.collection('userRoles').doc(role).set({ permissions });
	}
};
