import { z } from 'zod';

export const invitableUserOrgRoleSchema = z.enum(['viewer', 'collaborator', 'editor', 'orgAdmin']);
export const userOrgRoleSchema = z.enum([...invitableUserOrgRoleSchema._def.values, 'owner']);

export const userOrgConfigSchema = z.object({
	id: z.string(),
	role: userOrgRoleSchema
});
export type UserOrgConfig = z.infer<typeof userOrgConfigSchema>;

export const orgInviteSchema = z.object({
	id: z.string(),
	role: invitableUserOrgRoleSchema
});

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	orgInvites: z.record(z.string(), orgInviteSchema),
	orgs: z.record(z.string(), userOrgConfigSchema),
	primaryOrgId: z.string()
});
export type User = z.infer<typeof userSchema>;
