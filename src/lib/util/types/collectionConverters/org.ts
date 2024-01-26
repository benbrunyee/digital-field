import { orgSchema, type Org } from '../../../OrgCreator/types/orgType';
import { convertFirestoreTimestamps } from '../convertFirestoreTimestamp';

export const parseOrg = (org: any) => {
	const dateFields: (keyof Partial<Org>)[] = ['createdAt', 'updatedAt'];
	const orgParsed = orgSchema.parse(convertFirestoreTimestamps(org, dateFields));
	return orgParsed;
};
