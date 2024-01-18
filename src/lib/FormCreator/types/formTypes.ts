import { z } from 'zod';
import type { UnsavedInputEntity } from '../../InputEntity/types/inputEntity';
import {
	outputEntitySchema,
	unsavedOutputEntitySchema,
	type OutputEntity,
	type UnsavedOutputEntity
} from '../../OutputCreator/types/outputEntityTypes';
import { implement } from '../../util/types/typeToZod';
import {
	unsavedDisplayFieldSchema,
	unsavedInputFieldSchema,
	type UnsavedFormField
} from './fieldTypes';

/**
 * A form is what you would expect, a entity that contains fields specifically for inputting data.
 * A form determines what data can be collected for the entity.
 * This data can then be used in an output e.g., PDF.
 */

const entryStateSchema = z.object({
	name: z.string(),
	colour: z.string()
});
export type EntryState = z.infer<typeof entryStateSchema>;

const formOptionsSchema = z.object({
	entryStates: z.array(entryStateSchema)
});
export type FormOptions = z.infer<typeof formOptionsSchema>;

const formStatusSchema = z.enum(['draft', 'active', 'disabled', 'deleted']);
export type FormStatus = z.infer<typeof formStatusSchema>;

export const unsavedFormSchema = implement<UnsavedForm>().with({
	fields: z.union([z.array(unsavedInputFieldSchema), z.array(unsavedDisplayFieldSchema)]),
	name: z.string(),
	type: z.enum(['form']),
	status: formStatusSchema,
	options: z.object({
		entryStates: z.array(
			z.object({
				name: z.string(),
				colour: z.string()
			})
		)
	}),
	outputs: z.array(unsavedOutputEntitySchema),
	orgId: z.string()
});
export interface UnsavedForm extends UnsavedInputEntity<UnsavedForm, UnsavedFormField> {
	status: FormStatus;
	options: FormOptions;
	outputs: UnsavedOutputEntity[];
}

export const formSchema = implement<Form>().with({
	...unsavedFormSchema.shape,
	ownerId: z.string(),
	id: z.string(),
	updatedAt: z.date(),
	createdAt: z.date(),
	outputs: z.array(outputEntitySchema)
});
export interface Form extends UnsavedForm {
	id: string;
	ownerId: string;
	outputs: OutputEntity[];
	createdAt: Date;
	updatedAt: Date;
}
