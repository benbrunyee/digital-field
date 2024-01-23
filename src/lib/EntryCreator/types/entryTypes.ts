import { z } from 'zod';

export const entryValueTypeSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
]);
export type EntryValueType = z.infer<typeof entryValueTypeSchema>;

export const entryFieldSchema = z.object({
	fieldId: z.string(),
	value: z.union([entryValueTypeSchema, z.array(entryValueTypeSchema)])
});
export type EntryField = z.infer<typeof entryFieldSchema>;

export const existingEntryFieldSchema = entryFieldSchema.extend({
	id: z.string()
});
export type ExistingEntryField = z.infer<typeof existingEntryFieldSchema>;

export const newEntryFieldSchema = entryFieldSchema.extend({
	clientId: z.string()
});
export type NewEntryField = z.infer<typeof newEntryFieldSchema>;

export const entryFieldCreateRequestSchema = newEntryFieldSchema.omit({
	clientId: true
});
export type EntryFieldCreateRequest = z.infer<typeof entryFieldCreateRequestSchema>;

export const entryFieldUpdateRequestSchema = existingEntryFieldSchema;

export const entrySchema = z.object({
	formId: z.string(),
	ownerId: z.string(),
	status: z.string(),
	fields: z.array(z.any())
});
export type Entry = z.infer<typeof entrySchema>;

export const existingEntrySchema = entrySchema.extend({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	fields: z.array(z.union([existingEntryFieldSchema, newEntryFieldSchema]))
});
export type ExistingEntry = z.infer<typeof existingEntrySchema>;

export const newEntrySchema = entrySchema.extend({
	clientId: z.string(),
	fields: z.array(newEntryFieldSchema)
});
export type NewEntry = z.infer<typeof newEntrySchema>;

const entryCreateRequestSchema = newEntrySchema.extend({
	clientId: z.void(),
	fields: z.array(entryFieldCreateRequestSchema)
});
export type EntryCreateRequest = z.infer<typeof entryCreateRequestSchema>;

export const entryUpdateRequestSchema = existingEntrySchema;
export type EntryUpdateRequest = z.infer<typeof entryUpdateRequestSchema>;
