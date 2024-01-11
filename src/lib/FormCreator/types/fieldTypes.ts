import { z } from 'zod';
import { implement } from '../../util/typeToZod';

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
	'link'
] as const;
export const displayFieldTypes = ['heading', 'subheading', 'separator'] as const;
export const fieldTypes = [...inputFieldTypes, ...displayFieldTypes] as const;

// Field Typescript types

export type InputFieldType = (typeof inputFieldTypes)[number];
export type DisplayFieldType = (typeof displayFieldTypes)[number];
export type FieldType = InputFieldType | DisplayFieldType;

// Field object Typescript types

interface FieldBaseI<T extends FieldType> {
	id: string;
	type: T;
	createdAt: Date | undefined;
	updatedAt: Date | undefined;
}

export interface InputFieldI<T extends InputFieldType> extends FieldBaseI<T> {
	name: string;
	required: boolean;
	options: InputFieldOptions<T> | undefined;
	placeholder: string;
	description: string;
}
export interface DisplayFieldI<T extends DisplayFieldType> extends FieldBaseI<T> {
	options: DisplayFieldOptions<T> | undefined;
}
export type FieldI = InputFieldI<InputFieldType> | DisplayFieldI<DisplayFieldType>;

export const InputFieldISchema = implement<InputFieldI<InputFieldType>>().with({
	id: z.string(),
	type: z.enum(inputFieldTypes),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	name: z.string(),
	required: z.boolean(),
	options: z.any().optional(),
	placeholder: z.string(),
	description: z.string()
});

export const DisplayFieldISchema = implement<DisplayFieldI<DisplayFieldType>>().with({
	id: z.string(),
	type: z.enum(displayFieldTypes),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	options: z.any().optional()
});

export const FieldISchema = z.union([InputFieldISchema, DisplayFieldISchema]);

// TODO: Field options

export type InputFieldOptions<T extends InputFieldType> = T extends 'text' ? TextOptions : T;
export type TextOptions = {
	placeholder: string;
};

export type DisplayFieldOptions<T extends DisplayFieldType> = T extends 'h1' ? H1Options : T;
export type H1Options = {
	bold: boolean;
};
