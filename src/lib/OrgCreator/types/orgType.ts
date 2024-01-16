import { z } from 'zod';

const OrgPlanSchema = z.enum(['standard']);
export type OrgPlan = z.infer<typeof OrgPlanSchema>;

const OrgSchema = z.object({
	id: z.string(),
	name: z.string(),
	ownerId: z.string(),
	users: z.array(z.string()),
	plan: OrgPlanSchema,
	createdAt: z.date(),
	updatedAt: z.date()
});
export type Org = z.infer<typeof OrgSchema>;
