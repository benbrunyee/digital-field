import type { InputFieldType } from '../../FormCreator/types/fieldTypes';

/**
 * Types of fields:
 * - Output fields: These fields are a version of only the input fields purely for printing purposes (output PDFs).
 * 	   This is used for determining the output for a given input field e.g., text, number, date, etc.
 */

// Top-level available field types

export const outputDisplayFieldTypes = ['heading', 'subheading', 'divider'] as const;

// Field Typescript types

export type OutputInputFieldType = InputFieldType;
export type OutputDisplayFieldType = (typeof outputDisplayFieldTypes)[number];
export type OutputFieldType = OutputInputFieldType | OutputDisplayFieldType;

// Field object Typescript types

interface OutputBaseI<T extends OutputFieldType> {
	id: string;
	type: T;
	createdAt: Date | undefined;
	updatedAt: Date | undefined;
}
export interface OutputInputFieldI<T extends OutputInputFieldType> extends OutputBaseI<T> {
	options: OutputInputFieldOptions<T> | undefined;
}
export interface OutputDisplayFieldI<T extends OutputDisplayFieldType> extends OutputBaseI<T> {
	options: OutputDisplayFieldOptions<T> | undefined;
}
export type OutputFieldI =
	| OutputDisplayFieldI<OutputDisplayFieldType>
	| OutputInputFieldI<OutputInputFieldType>;

// Field options

export type OutputInputFieldOptions<T extends InputFieldType> = T extends 'text'
	? TextOutputOptions
	: T;

export type BaseOutputFieldOptions = {
	css: string;
	hidden: boolean;
};

export type TextOutputOptions = BaseOutputFieldOptions & {
	css: string;
};

export type OutputDisplayFieldOptions<T extends OutputDisplayFieldType> = T extends 'h1'
	? H1OutputOptions
	: T;

export type H1OutputOptions = BaseOutputFieldOptions & {
	css: string;
};
