import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	orgId: z.string(),
	orgName: z.string(),
	role: z.string()
});

export interface User {
	id: string;
	name: string;
	email: string;
	orgId: string;
	orgName: string;
	role: string;
}
