// Top-level available form types

import type { WithId } from '../../util/types/withId';
import type { OutputField } from './outputFieldTypes';
import type { Template } from './template';

export const outputEntityStates = ['draft', 'active', 'disabled', ['deleted']] as const;

// Form Typescript types

type OutputEntityState = (typeof outputEntityStates)[number];

// Form object Typescript types

export interface OutputEntity {
	id: string;
	name: string;
	formId: string;
	updatedAt: Date | undefined;
	createdAt: Date | undefined;
	ownerId: string;
	overrides: Override[];
	template: Template;
	state: OutputEntityState;
	isCustom: boolean;
	fields: OutputField[];
}

export interface OutputEntityWithFieldIds extends OutputEntity {
	fields: WithId<OutputField>[];
}

export type Override = {
	id: string;
	fieldId: string;
	code: string;
};
