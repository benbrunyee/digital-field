import { z } from 'zod';

export const orgPlanSchema = z.enum(['standard']);
export type OrgPlan = z.infer<typeof orgPlanSchema>;

export const userOrgRoleSchema = z.enum(['viewer', 'collaborator', 'editor', 'orgAdmin', 'owner']);
export type UserOrgRole = z.infer<typeof userOrgRoleSchema>;

export const orgMemberSchema = z.object({
	id: z.string(),
	role: userOrgRoleSchema
});

export const orgSchema = z.object({
	id: z.string(),
	name: z.string(),
	ownerId: z.string(),
	members: z.record(z.string(), orgMemberSchema),
	plan: orgPlanSchema,
	createdAt: z.date(),
	updatedAt: z.date()
});
export type Org = z.infer<typeof orgSchema>;
