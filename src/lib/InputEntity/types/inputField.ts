import type { DisplayFieldType, InputFieldType } from '../../FormCreator/types/fieldTypes';
import type { InputEntity } from './inputEntity';

export interface InputEntityField<T extends InputEntityFieldType, O extends InputFieldOption> {
	id: string;
	type: T;
	createdAt: Date | undefined;
	updatedAt: Date | undefined;
	options: O;
}

export type InputFieldOption = {
	[key: string]: any;
};

export type MultiEntryFieldOption = {
	value: InputEntity;
};

export type InputEntityFieldType = InputFieldType | DisplayFieldType;
