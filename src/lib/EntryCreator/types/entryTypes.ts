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
	fields: z.record(z.string(), z.any())
});
export type Entry = z.infer<typeof entrySchema>;

export const existingEntrySchema = entrySchema.extend({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	fields: z.record(z.string(), z.union([existingEntryFieldSchema, newEntryFieldSchema]))
});
export type ExistingEntry = z.infer<typeof existingEntrySchema>;

export const newEntrySchema = entrySchema.extend({
	clientId: z.string(),
	fields: z.record(z.string(), newEntryFieldSchema)
});
export type NewEntry = z.infer<typeof newEntrySchema>;

const entryCreateRequestSchema = newEntrySchema.extend({
	clientId: z.void(),
	fields: z.record(z.string(), entryFieldCreateRequestSchema)
});
export type EntryCreateRequest = z.infer<typeof entryCreateRequestSchema>;

export const entryUpdateRequestSchema = existingEntrySchema;
export type EntryUpdateRequest = z.infer<typeof entryUpdateRequestSchema>;

export const choiceOptionSchema = z.object({
	options: z.record(
		z.string(),
		z.object({
			label: z.string(),
			value: z.string()
		})
	)
});
export type ChoiceOptionSchema = z.infer<typeof choiceOptionSchema>;

export const addressValueSchema = z.object({
	street1: z.string(),
	street2: z.string(),
	city: z.string(),
	state: z.string(),
	postalCode: z.string(),
	country: z.string()
});
export type AddressValueSchema = z.infer<typeof addressValueSchema>;
