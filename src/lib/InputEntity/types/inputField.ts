import type { DisplayFieldType, InputFieldType } from '../../FormCreator/types/fieldTypes';
import type { InputEntity } from './inputEntity';

export interface InputEntityField<T extends InputEntityFieldType, O extends InputFieldOption>
	extends UnsavedInputEntityField<T, O> {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface UnsavedInputEntityField<
	T extends InputEntityFieldType,
	O extends InputFieldOption
> {
	type: T;
	options: O;
}

export type InputFieldOption = {
	[key: string]: any;
};

export type MultiEntryFieldOption = {
	value: InputEntity;
};

export type InputEntityFieldType = InputFieldType | DisplayFieldType;
