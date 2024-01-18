import type { UnsavedForm } from '../../FormCreator/types/formTypes';
import type {
	InputEntityField,
	InputEntityFieldType,
	InputFieldOption,
	UnsavedInputEntityField
} from './inputField';

export interface InputEntity<
	T extends InputEntity | {} = {},
	F extends InputEntityField<InputEntityFieldType, InputFieldOption> | {} = {}
> extends UnsavedInputEntity<T, F> {
	id: string;
}

export interface UnsavedInputEntity<
	T extends UnsavedInputEntity | {} = {},
	F extends UnsavedInputEntityField<InputEntityFieldType, InputFieldOption> | {} = {}
> {
	name: string;
	fields: F[];
	type: InputEntityType<T>;
	orgId: string;
}

// TODO: Complete multientry type
export type InputEntityType<T> = T extends UnsavedForm
	? 'form'
	: T extends {}
		? null
		: 'multiEntry';
