// Top-level available form types

import { z } from 'zod';
import type { WithId } from '../../util/types/withId';
import { outputFieldSchema, type OutputField } from './outputFieldTypes';
import { templateSchema } from './template';

export const outputEntityStates = ['draft', 'active', 'disabled', 'deleted'] as const;

// Form Typescript types

export const outputEntityStatesSchema = z.enum(outputEntityStates);
export type OutputEntityState = z.infer<typeof outputEntityStatesSchema>;

export interface OutputEntityWithFieldIds extends OutputEntity {
	fields: WithId<OutputField>[];
}

export const overrideSchema = z.object({
	id: z.string(),
	fieldId: z.string(),
	code: z.string()
});
export type Override = z.infer<typeof overrideSchema>;

// Form object Typescript types

export const unsavedOutputEntitySchema = z.object({
	name: z.string(),
	formId: z.string(),
	ownerId: z.string(),
	overrides: z.array(overrideSchema),
	template: templateSchema,
	state: z.enum(outputEntityStates),
	isCustom: z.boolean(),
	fields: z.array(outputFieldSchema)
});
export type UnsavedOutputEntity = z.infer<typeof unsavedOutputEntitySchema>;

export const outputEntitySchema = z.object({
	...unsavedOutputEntitySchema.shape,
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type OutputEntity = z.infer<typeof outputEntitySchema>;
