import type { inputFieldTypes } from './fieldTypes';

export interface OutputEntity {
	id: string;
	name: string;
	owner: string;
	fields: OutputField[];
	last_updated: string;
	created: string;
	type: OutputEntityType;
}

export const outputEntityTypes = ['pdf'] as const;

export type OutputEntityType = (typeof outputEntityTypes)[number];

export interface OutputField {}

export type OutputFieldOptions<T extends (typeof inputFieldTypes)[number]> = T extends 'text'
	? TextOutputOptions
	: T;

export type BaseOutputFieldOptions = {
	css: string;
	hidden: boolean;
};

export type TextOutputOptions = BaseOutputFieldOptions & {
	css: string;
};
