import type { Form } from '../../FormCreator/types/formTypes';
import type { InputEntityField, InputEntityFieldType, InputFieldOption } from './inputField';

export interface InputEntity<
	T extends InputEntity | {} = {},
	F extends InputEntityField<InputEntityFieldType, InputFieldOption> | {} = {}
> {
	id: string;
	name: string;
	updatedAt: Date | undefined;
	createdAt: Date | undefined;
	fields: F[];
	type: InputEntityType<T>;
}

// TODO: Complete multientry type
export type InputEntityType<T> = T extends Form ? 'form' : T extends {} ? null : 'multiEntry';
