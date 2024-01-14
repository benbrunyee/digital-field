import { createId } from '../../util/createId';
import type { Form } from '../types/formTypes';
import { createFieldRef } from './createFields';

export const createForm = async (form: Form) => {
	// TODO: Implement
	try {
	} catch (e) {
		console.error(e);
	}
};

export const createFormStructure = (): Form => ({
	id: '1',
	name: 'Form Name',
	createdAt: new Date(),
	fields: [
		{
			id: createId('date'),
			name: 'Date of Survey',
			ref: createFieldRef('Date of Survey'),
			type: 'date',
			options: {},
			required: false,
			description: '',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: createId('text'),
			name: 'Surveyor Name',
			ref: createFieldRef('Surveyor Name'),
			type: 'text',
			options: {},
			required: false,
			description: '',
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: createId(''),
			name: 'Plant details',
			ref: createFieldRef('Plant details'),
			type: 'multi-entry',
			options: {},
			required: false,
			description: '',
			createdAt: new Date(),
			updatedAt: new Date()
		}
	],
	updatedAt: new Date(),
	outputs: [],
	ownerId: '',
	options: {
		entryStates: []
	},
	status: 'draft',
	type: 'form'
});
