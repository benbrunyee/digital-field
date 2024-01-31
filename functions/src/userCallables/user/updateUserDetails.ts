import { HttpsError } from 'firebase-functions/v1/auth';
import { z } from 'zod';
import { AuthenticatedCallableRequest } from '../../util/middleware/withAuth';
import { updateDocValue } from '../../util/updateDocValue';

export const updateUserDetailsDataSchema = z.object({
	displayName: z.string().optional(),
	email: z.string().optional(),
	photoBase64: z.string().optional()
});
export type UpdateUserDetailsData = z.infer<typeof updateUserDetailsDataSchema>;

export const updateUserDetailsFn = async (request: AuthenticatedCallableRequest) => {
	const parseResult = updateUserDetailsDataSchema.safeParse(request.data);

	if (!parseResult.success) {
		throw new HttpsError('invalid-argument', 'Invalid data', parseResult.error);
	}

	try {
		for (const key of ['displayName', 'email', 'photoBase64']) {
			if (request.data[key]) {
				await updateDocValue(request.auth.uid, key, request.data[key]);
			}
		}
	} catch (e) {
		throw new HttpsError('internal', 'An error occurred while updating user details');
	}
};
