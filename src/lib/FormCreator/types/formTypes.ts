import { z } from 'zod';

/**
 * A form is what you would expect, a entity that contains fields specifically for inputting data.
 * A form determines what data can be collected for the entity.
 * This data can then be used in an output e.g., PDF.
 */

const formStatusSchema = z.enum(['draft', 'active', 'disabled', 'deleted']);
export type FormStatus = z.infer<typeof formStatusSchema>;

export const formOptionsSchema = z.union([
	z.record(z.string(), z.any()),
	z.object({
		entryStates: z.array(
			z.object({
				name: z.string(),
				colour: z.string()
			})
		)
	})
]);
export type FormOptions = z.infer<typeof formOptionsSchema>;

export const formTypeSchema = z.enum(['form']);
export type FormType = z.infer<typeof formTypeSchema>;

export const formSchema = z.object({
	name: z.string(),
	fields: z.array(z.any()), // TODO
	ownerId: z.string(),
	orgId: z.string(),
	type: formTypeSchema,
	options: formOptionsSchema,
	status: formStatusSchema,
	outputs: z.array(z.any()) // TODO
});
export type Form = z.infer<typeof formSchema>;

export const existingFormSchema = formSchema.extend({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date()
});
export type ExistingForm = z.infer<typeof existingFormSchema>;

export const newFormSchema = formSchema.extend({
	clientId: z.string()
});
export type NewForm = z.infer<typeof newFormSchema>;

export const formCreateRequestSchema = newFormSchema.omit({
	clientId: true
});
export type FormCreateRequest = z.infer<typeof formCreateRequestSchema>;

export const formUpdateRequestSchema = existingFormSchema.omit({
	createdAt: true,
	updatedAt: true
});
export type FormUpdateRequest = z.infer<typeof formUpdateRequestSchema>;
