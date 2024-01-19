// Top-level available form types

import { z } from 'zod';
import { outputFieldSchema } from './outputFieldTypes';
import { templateSchema } from './template';

export const outputEntityStates = ['draft', 'active', 'disabled', 'deleted'] as const;

// OutputEntity Typescript types

export const overrideSchema = z.object({
	id: z.string(),
	fieldId: z.string(),
	code: z.string()
});
export type Override = z.infer<typeof overrideSchema>;

export const outputEntityStatesSchema = z.enum(outputEntityStates);
export type OutputEntityState = z.infer<typeof outputEntityStatesSchema>;

export const outputEntitySchema = z.object({
	name: z.string(),
	formId: z.string(),
	ownerId: z.string(),
	overrides: z.array(overrideSchema),
	template: templateSchema, // TODO
	state: outputEntityStatesSchema,
	isCustom: z.boolean(),
	fields: z.array(outputFieldSchema)
});
export type OutputEntity = z.infer<typeof outputEntitySchema>;

export const existingOutputEntitySchema = outputEntitySchema.extend({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type ExistingOutputEntity = z.infer<typeof existingOutputEntitySchema>;

export const newOutputEntitySchema = outputEntitySchema.extend({
	clientId: z.string()
});
export type NewOutputEntity = z.infer<typeof newOutputEntitySchema>;

export const outputEntityCreateRequestSchema = newOutputEntitySchema.omit({
	clientId: true
});
export type OutputEntityCreateRequest = z.infer<typeof outputEntityCreateRequestSchema>;

export const outputEntityUpdateRequestSchema = existingOutputEntitySchema.omit({
	createdAt: true,
	updatedAt: true
});
export type OutputEntityUpdateRequest = z.infer<typeof outputEntityUpdateRequestSchema>;
