import { orgSchema } from '../../../OrgCreator/types/orgType';

export const parseOrg = (org: any) => {
	const orgParsed = orgSchema.parse(org);
	return orgParsed;
};
