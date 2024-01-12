import { z } from 'zod';
import type { InputEntityField } from '../../InputEntity/types/inputField';
import { implement } from '../../util/types/typeToZod';

/**
 * Types of fields:
 * - Input fields: These are fields that are displayed to the user when they are filling out the form (inputting data) e.g., text, number, date, etc.
 * - Display fields: These are fields that are used for display purposes, these are read-only when inputting data e.g., h1, h2, separator, etc.
 */

// Top-level available field types

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
export const displayFieldTypes = ['heading', 'subheading', 'paragraph', 'separator'] as const;
export const allFormFieldTypes = [...inputFieldTypes, ...displayFieldTypes] as const;

// Field Typescript types

export type InputFieldType = (typeof inputFieldTypes)[number];
export type DisplayFieldType = (typeof displayFieldTypes)[number];

export type FormFieldTypes = InputFieldType | DisplayFieldType;

// Field object Typescript types

export interface InputField<T extends InputFieldType>
	extends InputEntityField<T, InputFieldOptions<T>> {
	name: string;
	ref: string;
	required: boolean;
	description: string;
}
export interface DisplayField<T extends DisplayFieldType>
	extends InputEntityField<T, DisplayFieldOptions<T>> {
	value?: string;
}

export type FormField = InputField<InputFieldType> | DisplayField<DisplayFieldType>;

export const InputFieldSchema = implement<InputField<InputFieldType>>().with({
	id: z.string(),
	ref: z.string(),
	type: z.enum(inputFieldTypes),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	name: z.string(),
	required: z.boolean(),
	options: z.any().optional(),
	description: z.string()
});

export const DisplayFieldSchema = implement<DisplayField<DisplayFieldType>>().with({
	id: z.string(),
	value: z.string().optional(),
	type: z.enum(displayFieldTypes),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	options: z.any().optional()
});

export const FormFieldSchema = z.union([InputFieldSchema, DisplayFieldSchema]);

// TODO: Field options

export type InputFieldOptions<T extends InputFieldType> = T extends 'text' ? TextOptions : {};
export type TextOptions = {
	placeholder: string;
};

export type DisplayFieldOptions<T extends DisplayFieldType> = T extends 'heading' ? H1Options : {};
export type H1Options = {
	bold: boolean;
};
