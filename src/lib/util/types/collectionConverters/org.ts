import type { DocumentData } from 'firebase/firestore';
import { orgSchema, type Org } from '../../../OrgCreator/types/orgType';

export const parseOrg = (org: DocumentData): Org => {
	const orgParsed = orgSchema.parse(org);
	return orgParsed;
};
