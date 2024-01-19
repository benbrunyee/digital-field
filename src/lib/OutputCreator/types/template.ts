import { z } from 'zod';
import type { OutputFieldType } from './outputFieldTypes';

const templateTypeSchema = z.enum(['pdf']);
export type TemplateType = z.infer<typeof templateTypeSchema>;

export const pageTypeSchema = z.enum(['code', 'pdf']);
export type PageType = z.infer<typeof pageSchema>;

export const pageSchema = z.object({
	type: pageTypeSchema,
	value: z.string()
});
export type Page = {
	id: string;
	type: PageType;
	value: string;
};

export const fieldTemplateSchema = z.object({
	id: z.string(), // TODO
	type: z.enum([
		'text',
		'image',
		'signature',
		'date',
		'checkbox',
		'radio',
		'dropdown',
		'number',
		'file'
	]),
	code: z.string()
});
export type FieldTemplate = {
	id: string;
	type: OutputFieldType;
	code: string;
};

export const templateOptionsSchema = z.record(z.string(), z.any());
export type TemplateOptions = z.infer<typeof templateOptionsSchema>;

export const templateSchema = z.object({
	type: templateTypeSchema,
	topPage: pageSchema.optional(),
	tailPage: pageSchema.optional(),
	fieldTemplates: z.array(fieldTemplateSchema),
	options: templateOptionsSchema
});
export type Template = z.infer<typeof templateSchema>;
