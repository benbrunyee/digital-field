import { get } from 'svelte/store';
import { createId } from '../../util/createId';
import { userStore } from '../../util/user/stores/userStore';
import type { NewOutputEntity } from '../types/outputEntityTypes';

export const createOutputEntityStructure = (): NewOutputEntity => {
	const uid = get(userStore).id;

	if (!uid) {
		throw new Error('User not logged in');
	}

	return {
		name: 'New Output Entity',
		clientId: createId('outputEntity'),
		fields: [],
		formId: '',
		isCustom: false,
		overrides: [],
		ownerId: uid,
		state: 'draft',
		template: {
			fieldTemplates: [],
			options: {},
			type: 'pdf'
		}
	};
};

export const createOutputEntity = () => {};
