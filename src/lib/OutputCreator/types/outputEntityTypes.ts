import type { OutputFieldI } from './outputFieldTypes';

// Top-level available form types

export const outputEntityTypes = ['pdf'] as const;
export const outputEntityStates = ['draft', 'published', 'archived'] as const;

// Form Typescript types

export type OutputEntityTypes = (typeof outputEntityTypes)[number];
export type OutputEntityState = (typeof outputEntityStates)[number];

// Form object Typescript types

export interface OutputEntityI {
	id: string;
	name: string;
	type: OutputEntityTypes;
	fields: OutputFieldI[];
	owner: string;
	state: OutputEntityState;
	updatedAt: Date | undefined;
	createdAt: Date | undefined;
}
