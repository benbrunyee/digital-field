// TODO: Complete types

export interface Field<T extends MergedFieldTypes> {
	id: string;
	name: string;
	type: T;
	required: boolean;
	options: FieldOptions<T>[];
	value: string;
}

export const fieldTypes = [
	'text',
	'number',
	'date',
	'time',
	'checkbox',
	'choice',
	'multiple-choice',
	'image',
	'video',
	'audio',
	'signature',
	'file',
	'address',
	'link'
] as const;

export const displayElementTypes = ['h1', 'h2', 'separator'] as const;

export type FieldType = (typeof fieldTypes)[number];

export type DisplayElementType = (typeof displayElementTypes)[number];

export type MergedFieldTypes = FieldType | DisplayElementType;

export type FieldOptions<T extends MergedFieldTypes> = T extends 'text' ? TextOptions : T;

export type TextOptions = {
	placeholder: string;
};
