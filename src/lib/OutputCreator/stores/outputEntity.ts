import { writable } from 'svelte/store';
import type { OutputEntityI } from '../types/outputEntityTypes';

export const outputEntityStore = (initialValue?: OutputEntityI) => {
	const store = writable<OutputEntityI>(
		initialValue ?? {
			id: '1',
			name: 'Test Output Entity',
			fields: [],
			owner: '',
			state: 'draft',
			type: 'pdf',
			updatedAt: undefined,
			createdAt: undefined
		}
	);

	return {
		...store
	};
};
