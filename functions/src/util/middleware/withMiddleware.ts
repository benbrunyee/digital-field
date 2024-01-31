import { withAuth } from './withAuth';
import { withErrorCatcher } from './withErrorCatcher';

export type MiddlewareOptions = {
	withAuth: boolean;
	withErrorCatcher: boolean;
};

export const withMiddleware =
	(
		fn: (request: any) => any,
		options: MiddlewareOptions = {
			withAuth: true,
			withErrorCatcher: true
		}
	) =>
	(request: any) => {
		let fnCallStack = fn;

		options.withAuth && (fnCallStack = withAuth(fnCallStack));
		options.withErrorCatcher && (fnCallStack = withErrorCatcher(fnCallStack));

		return fnCallStack(request);
	};
