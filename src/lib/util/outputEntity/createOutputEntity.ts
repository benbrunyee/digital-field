import { get } from 'svelte/store';
import type { NewOutputEntity } from '../../OutputCreator/types/outputEntityTypes';
import { createId } from '../createId';
import { userStore } from '../user/stores/userStore';

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
