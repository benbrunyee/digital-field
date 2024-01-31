import { error } from 'firebase-functions/logger';
import { HttpsError } from 'firebase-functions/v1/auth';

export const withErrorCatcher = (fn: (request: any) => any) => (request: any) =>
	Promise.resolve<any>(fn(request)).catch((e) => {
		error(e);
		throw new HttpsError('unknown', 'An unknown error occurred');
	});
