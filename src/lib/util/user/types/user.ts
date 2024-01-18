import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	orgInvites: z.record(
		z.string(),
		z.object({
			id: z.string(),
			role: z.string()
		})
	),
	orgs: z.record(
		z.string(),
		z.object({
			id: z.string(),
			role: z.string()
		})
	)
});
export type User = z.infer<typeof userSchema>;
