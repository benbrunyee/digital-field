/**
 * Types of fields:
 * - Output fields: These fields are a version of only the input fields purely for printing purposes (output PDFs).
 * 	   This is used for determining the output for a given input field e.g., text, number, date, etc.
 */

import { z } from 'zod';
import { inputFieldTypes } from '../../FormCreator/types/fieldTypes';

// Display field types

export const outputDisplayFieldTypes = [
	'heading',
	'subheading',
	'paragraph',
	'divider',
	'html'
] as const;
export const outputDisplayFieldTypesSchema = z.enum(outputDisplayFieldTypes);
export type OutputDisplayFieldType = z.infer<typeof outputDisplayFieldTypesSchema>;

export const outputDisplayFieldSchema = z.object({
	type: outputDisplayFieldTypesSchema,
	value: z.string().optional()
});
export type OutputDisplayField = z.infer<typeof outputDisplayFieldSchema>;

export const existingOutputDisplayFieldSchema = outputDisplayFieldSchema.extend({
	id: z.string()
});
export type ExistingOutputDisplayField = z.infer<typeof existingOutputDisplayFieldSchema>;

export const newOutputDisplayFieldSchema = outputDisplayFieldSchema.extend({
	clientId: z.string()
});
export type NewOutputDisplayField = z.infer<typeof newOutputDisplayFieldSchema>;

export const outputDisplayFieldCreateRequestSchema = newOutputDisplayFieldSchema.omit({
	clientId: true
});
export type OutputDisplayFieldCreateRequest = z.infer<typeof outputDisplayFieldCreateRequestSchema>;

export const outputDisplayFieldUpdateRequestSchema = existingOutputDisplayFieldSchema;
export type OutputDisplayFieldUpdateRequest = z.infer<typeof outputDisplayFieldUpdateRequestSchema>;

// Output input field types

export const outputInputFieldTypes = inputFieldTypes;
export const outputInputFieldTypesSchema = z.enum(outputInputFieldTypes);
export type OutputInputFieldType = z.infer<typeof outputInputFieldTypesSchema>;

export const outputInputFieldSchema = z.object({
	fieldId: z.string(),
	type: outputInputFieldTypesSchema
});
export type OutputInputField = z.infer<typeof outputInputFieldSchema>;

export const existingOutputInputFieldSchema = outputInputFieldSchema.extend({
	id: z.string()
});
export type ExistingOutputInputField = z.infer<typeof existingOutputInputFieldSchema>;

export const newOutputInputFieldSchema = outputInputFieldSchema.extend({
	clientId: z.string()
});
export type NewOutputInputField = z.infer<typeof newOutputInputFieldSchema>;

export const outputInputFieldCreateRequestSchema = newOutputInputFieldSchema.omit({
	clientId: true
});
export type OutputInputFieldCreateRequest = z.infer<typeof outputInputFieldCreateRequestSchema>;

export const outputInputFieldUpdateRequestSchema = existingOutputInputFieldSchema;
export type OutputInputFieldUpdateRequest = z.infer<typeof outputInputFieldUpdateRequestSchema>;

// Output field types

export const outputFieldTypes = [...outputInputFieldTypes, ...outputDisplayFieldTypes] as const;
export const outputFieldTypesSchema = z.enum(outputFieldTypes);
export type OutputFieldType = z.infer<typeof outputFieldTypesSchema>;

export const outputFieldSchema = z.union([outputInputFieldSchema, outputDisplayFieldSchema]);
export type OutputField = z.infer<typeof outputFieldSchema>;
