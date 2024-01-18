import { z } from 'zod';
import type { InputEntityField, UnsavedInputEntityField } from '../../InputEntity/types/inputField';
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

export const inputFieldTypesSchema = z.enum(inputFieldTypes);
export type InputFieldType = z.infer<typeof inputFieldTypesSchema>;
export const displayFieldTypesSchema = z.enum(displayFieldTypes);
export type DisplayFieldType = z.infer<typeof displayFieldTypesSchema>;

export type FormFieldTypes = InputFieldType | DisplayFieldType;

// Field object Typescript types

export interface InputField<T extends InputFieldType>
	extends InputEntityField<T, InputFieldOptions<T>> {
	name: string;
	ref: string;
	required: boolean;
	description: string;
}
export interface UnsavedInputField<T extends InputFieldType>
	extends UnsavedInputEntityField<T, InputFieldOptions<T>> {
	name: string;
	ref: string;
	required: boolean;
	description: string;
}

export interface DisplayField<T extends DisplayFieldType>
	extends InputEntityField<T, DisplayFieldOptions<T>> {
	value?: string;
}
export interface UnsavedDisplayField<T extends DisplayFieldType>
	extends UnsavedInputEntityField<T, DisplayFieldOptions<T>> {
	value?: string;
}

export type FormField = InputField<InputFieldType> | DisplayField<DisplayFieldType>;
export type UnsavedFormField =
	| UnsavedInputField<InputFieldType>
	| UnsavedDisplayField<DisplayFieldType>;

export const inputFieldSchema = implement<InputField<InputFieldType>>().with({
	id: z.string(),
	ref: z.string(),
	type: z.enum(inputFieldTypes),
	createdAt: z.date(),
	updatedAt: z.date(),
	name: z.string(),
	required: z.boolean(),
	options: z.record(z.string(), z.any()),
	description: z.string()
});
export const unsavedInputFieldSchema = implement<UnsavedInputField<InputFieldType>>().with({
	ref: z.string(),
	type: z.enum(inputFieldTypes),
	name: z.string(),
	required: z.boolean(),
	options: z.record(z.string(), z.any()),
	description: z.string()
});

export const displayFieldSchema = implement<DisplayField<DisplayFieldType>>().with({
	id: z.string(),
	value: z.string().optional(),
	type: z.enum(displayFieldTypes),
	createdAt: z.date(),
	updatedAt: z.date(),
	options: z.record(z.string(), z.any())
});
export const unsavedDisplayFieldSchema = implement<UnsavedDisplayField<DisplayFieldType>>().with({
	type: z.enum(displayFieldTypes),
	value: z.string().optional(),
	options: z.record(z.string(), z.any())
});

export const formFieldSchema = z.union([inputFieldSchema, displayFieldSchema]);

// TODO: Field options

export type InputFieldOptions<T extends InputFieldType> = T extends 'text' ? TextOptions : {};
export type TextOptions = {
	placeholder: string;
};

export type DisplayFieldOptions<T extends DisplayFieldType> = T extends 'heading' ? H1Options : {};
export type H1Options = {
	bold: boolean;
};
