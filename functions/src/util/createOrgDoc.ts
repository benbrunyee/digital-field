import { getFirestore } from 'firebase-admin/firestore';
import { log } from 'firebase-functions/logger';
import { z } from 'zod';
import { ORG_COLLECTION, USER_COLLECTION } from './types/collections';

const firestore = getFirestore();

export const userOrgRoleSchema = z.enum(['viewer', 'collaborator', 'editor', 'orgAdmin', 'owner']);

export const userOrgConfigSchema = z.object({
	id: z.string(),
	role: userOrgRoleSchema
});
export type UserOrgConfig = z.infer<typeof userOrgConfigSchema>;

const orgPlanSchema = z.enum(['standard']);
export type OrgPlan = z.infer<typeof orgPlanSchema>;

const orgSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
	members: z.record(z.string(), z.object({ id: z.string(), role: userOrgRoleSchema })),
	plan: orgPlanSchema,
	createdAt: z.date(),
	updatedAt: z.date()
});
export type Org = z.infer<typeof orgSchema>;

export const createOrgDoc = async (ownerId: string) => {
	const userDoc = await firestore.collection(USER_COLLECTION).doc(ownerId).get();
	const userData = userDoc.data();

	if (!userDoc.exists) throw new Error('User doc does not exist');
	if (!userData) throw new Error('User doc data is undefined');

	// Check if user is already an owner of an org
	if (
		userData.orgs &&
		Object.values<UserOrgConfig>(userData.orgs).some((org) => org.role === 'owner')
	) {
		throw new Error('User is already an owner of an org');
	}

	const date = new Date();

	const org: Org = {
		// We don't have the org name yet so we'll set it to an empty string
		// this will allow the user to set the org name on the second step of the sign-in page
		name: '',
		members: {
			[ownerId]: {
				id: ownerId,
				role: 'owner'
			}
		},
		ownerId,
		plan: 'standard',
		createdAt: date,
		updatedAt: date
	};

	log('Creating org doc', org);
	const orgRef = await firestore.collection(ORG_COLLECTION).add(org);
	firestore.collection(ORG_COLLECTION).doc(orgRef.id).update({ id: orgRef.id });

	const userOrgConfig: UserOrgConfig = {
		id: orgRef.id,
		role: 'owner'
	};

	log('Updating user doc', userOrgConfig);
	return await firestore
		.collection(USER_COLLECTION)
		.doc(ownerId)
		.update({
			[`orgs.${orgRef.id}`]: userOrgConfig,
			primaryOrgId: orgRef.id
		});
};
