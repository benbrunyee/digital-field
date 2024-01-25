import { z } from 'zod';

/**
 * Types of fields:
 * - Input fields: These are fields that are displayed to the user when they are filling out the form (inputting data) e.g., text, number, date, etc.
 * - Display fields: These are fields that are used for display purposes, these are read-only when inputting data e.g., h1, h2, separator, etc.
 */

// Input field types

export const inputFieldTypes = [
	'text',
	'number',
	'date',
	'time',
	'checkbox',
	'choice',
	'multiple_choice',
	'image',
	'video',
	'audio',
	'signature',
	'file',
	'address',
	'link',
	'multi-entry'
] as const;
export const inputFieldTypesSchema = z.enum(inputFieldTypes);
export type InputFieldType = z.infer<typeof inputFieldTypesSchema>;

export const inputFieldOptionsSchema = z.record(z.string(), z.any());
export type InputFieldOptions = z.infer<typeof inputFieldOptionsSchema>;

export const inputFieldSchema = z.object({
	name: z.string(),
	ref: z.string(),
	required: z.boolean(),
	description: z.string(),
	type: inputFieldTypesSchema,
	options: inputFieldOptionsSchema
});
export type InputField = z.infer<typeof inputFieldSchema>;

export const existingInputFieldSchema = inputFieldSchema.extend({
	id: z.string()
});
export type ExistingInputField = z.infer<typeof existingInputFieldSchema>;

export const newInputFieldSchema = inputFieldSchema.extend({
	clientId: z.string()
});
export type NewInputField = z.infer<typeof newInputFieldSchema>;

export const inputFieldCreateRequestSchema = newInputFieldSchema.omit({
	clientId: true
});
export type InputFieldCreateRequest = z.infer<typeof inputFieldCreateRequestSchema>;

export const inputFieldUpdateRequestSchema = existingInputFieldSchema;
export type InputFieldUpdateRequest = z.infer<typeof inputFieldUpdateRequestSchema>;

// Display field types

export const displayFieldTypes = ['heading', 'subheading', 'paragraph', 'separator'] as const;
export const displayFieldTypesSchema = z.enum(displayFieldTypes);
export type DisplayFieldType = z.infer<typeof displayFieldTypesSchema>;

export const displayFieldOptionsSchema = z.record(z.string(), z.any());

export const displayFieldSchema = z.object({
	type: displayFieldTypesSchema,
	value: z.string().optional(),
	options: displayFieldOptionsSchema
});
export type DisplayField = z.infer<typeof displayFieldSchema>;

export const existingDisplayFieldSchema = displayFieldSchema.extend({
	id: z.string()
});
export type ExistingDisplayField = z.infer<typeof existingDisplayFieldSchema>;

export const newDisplayFieldSchema = displayFieldSchema.extend({
	clientId: z.string()
});
export type NewDisplayField = z.infer<typeof newDisplayFieldSchema>;

export const displayFieldCreateRequestSchema = newDisplayFieldSchema.omit({
	clientId: true
});
export type DisplayFieldCreateRequest = z.infer<typeof displayFieldCreateRequestSchema>;

export const displayFieldUpdateRequestSchema = existingDisplayFieldSchema;
export type DisplayFieldUpdateRequest = z.infer<typeof displayFieldUpdateRequestSchema>;

// All field types

export const allFormFieldTypes = [...inputFieldTypes, ...displayFieldTypes] as const;
export const formFieldTypesSchema = z.enum(allFormFieldTypes);
export type FormFieldTypes = InputFieldType | DisplayFieldType;
export const formFieldSchema = z.union([inputFieldSchema, displayFieldSchema]);
export type FormField = z.infer<typeof formFieldSchema>;
