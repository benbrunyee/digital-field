import type { OutputFieldType } from './outputFieldTypes';

export interface Template {
	id: string;
	type: TemplateType;
	topPage: Page | undefined;
	tailPage: Page | undefined;
	fieldTemplates: FieldTemplate[];
	options: TemplateOptions;
}

export type TemplateType = 'pdf';

export type Page = {
	id: string;
	type: PageType;
	value: string;
};

export type PageType = 'code' | 'pdf';

export type FieldTemplate = {
	id: string;
	type: OutputFieldType;
	code: string;
};

export type TemplateOptions = {
	[key: string]: any;
};
