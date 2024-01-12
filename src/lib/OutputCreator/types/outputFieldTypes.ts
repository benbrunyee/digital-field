import { z } from 'zod';
import {
	allFormFieldTypes,
	inputFieldTypes,
	type InputFieldType
} from '../../FormCreator/types/fieldTypes';
import { implement } from '../../util/types/typeToZod';

/**
 * Types of fields:
 * - Output fields: These fields are a version of only the input fields purely for printing purposes (output PDFs).
 * 	   This is used for determining the output for a given input field e.g., text, number, date, etc.
 */

// Top-level available field types

export const outputDisplayFieldTypes = [
	'heading',
	'subheading',
	'paragraph',
	'divider',
	'html'
] as const;
export const outputFieldTypes = [...allFormFieldTypes, ...outputDisplayFieldTypes] as const;

// Field Typescript types

export type OutputInputFieldType = InputFieldType;
export type OutputDisplayFieldType = (typeof outputDisplayFieldTypes)[number];
export type OutputFieldType = OutputInputFieldType | OutputDisplayFieldType;

// Field object Typescript types

export type OutputInputField<T extends OutputInputFieldType> = {
	fieldId: string;
	type: T;
};
export type OutputDisplayField<T extends OutputDisplayFieldType> = {
	type: T;
};

export const OutputInputFieldSchema = implement<OutputInputField<OutputInputFieldType>>().with({
	fieldId: z.string(),
	type: z.enum(inputFieldTypes)
});
export const OutputDisplayFieldSchema = implement<
	OutputDisplayField<OutputDisplayFieldType>
>().with({
	type: z.enum(outputDisplayFieldTypes)
});

export type OutputField =
	| OutputDisplayField<OutputDisplayFieldType>
	| OutputInputField<OutputInputFieldType>;
export const OutputFieldSchema = z.union([OutputDisplayFieldSchema, OutputInputFieldSchema]);
