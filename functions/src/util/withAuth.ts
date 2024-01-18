import { AuthData } from 'firebase-functions/lib/common/providers/tasks';
import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

export interface AuthenticatedCallableRequest<T = any> extends CallableRequest<T> {
	auth: AuthData;
}

export const withAuth =
	<T = any>(fn: (request: AuthenticatedCallableRequest<T>) => any) =>
	(request: CallableRequest) => {
		if (!isAuthenticatedCallableRequest(request)) {
			throw new HttpsError('permission-denied', 'User needs to be logged in');
		}
		return fn(request);
	};

function isAuthenticatedCallableRequest<T = any>(
	request: CallableRequest<T>
): request is AuthenticatedCallableRequest<T> {
	return Boolean(request.auth);
}
