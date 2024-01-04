/**
 * Types of fields:
 * - Input fields: These are fields that are displayed to the user when they are filling out the form (inputting data) e.g., text, number, date, etc.
 * - Display fields: These are fields that are used for display purposes, these are read-only when inputting data e.g., h1, h2, separator, etc.
 * - Output fields: These fields are a version of only the input fields purely for printing purposes (output PDFs).
 * 	   This is used for determining the output for a given input field e.g., text, number, date, etc.
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

// Field Typescript types

export type InputFieldType = (typeof inputFieldTypes)[number];
export type DisplayFieldType = (typeof displayFieldTypes)[number];
export type FieldTypes = InputFieldType | DisplayFieldType;

// Field object Typescript types

export interface FieldBaseI<T extends FieldTypes> {
	id: string;
	type: T;
}
export interface InputFieldI<T extends InputFieldType> extends FieldBaseI<T> {
	name: string;
	required: boolean;
	options: InputFieldOptions<T> | undefined;
	value: string;
}
export interface DisplayFieldI<T extends DisplayFieldType> extends FieldBaseI<T> {
	options: DisplayFieldOptions<T> | undefined;
}
export type FieldI = InputFieldI<InputFieldType> | DisplayFieldI<DisplayFieldType>;

// Field options

export type InputFieldOptions<T extends InputFieldType> = T extends 'text' ? TextOptions : T;
export interface TextOptions {
	placeholder: string;
}

export type DisplayFieldOptions<T extends DisplayFieldType> = T extends 'h1' ? H1Options : T;
export interface H1Options {
	bold: boolean;
}
