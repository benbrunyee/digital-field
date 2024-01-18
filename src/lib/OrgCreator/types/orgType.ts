import { z } from 'zod';

const orgPlanSchema = z.enum(['standard']);
export type OrgPlan = z.infer<typeof orgPlanSchema>;

const orgSchema = z.object({
	id: z.string(),
	name: z.string(),
	ownerId: z.string(),
	members: z.array(z.string()),
	plan: orgPlanSchema,
	createdAt: z.date(),
	updatedAt: z.date()
});
export type Org = z.infer<typeof orgSchema>;
