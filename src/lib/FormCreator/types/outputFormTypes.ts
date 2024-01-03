import type { fieldTypes } from './fieldTypes';

export interface OutputForm {
	id: string;
	name: string;
	owner: string;
	fields: OutputField[];
	last_updated: string;
	created: string;
}

export interface OutputField {}

export type OutputFieldOptions<T extends (typeof fieldTypes)[number]> = T extends 'text'
	? TextOutputOptions
	: T;

export type BaseOutputFieldOptions = {
	css: string;
	hidden: boolean;
};

export type TextOutputOptions = BaseOutputFieldOptions & {
	css: string;
};
