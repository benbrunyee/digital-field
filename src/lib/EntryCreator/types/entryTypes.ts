import type { EntryState } from '../../FormCreator/types/formTypes';

export interface Entry<T extends EntryState> {
	id: string;
	formId: string;
	fields: EntryField[];
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
	status: T | undefined;
}

export type EntryField = {
	id: string;
	fieldId: string;
	value: EntryValue;
};

export type EntryValue = EntryValueType | EntryValueType[];

export type EntryValueType = object | string | number | boolean | null;
