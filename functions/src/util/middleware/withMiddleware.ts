import { withAuth } from './withAuth';
import { withOnlyDev } from './withDev';
import { withErrorCatcher } from './withErrorCatcher';

export type MiddlewareOptions = {
	withAuth?: boolean;
	withErrorCatcher?: boolean;
	onlyDev?: boolean;
};

export const withMiddleware =
	(
		fn: (request: any) => any,
		options: MiddlewareOptions = {
			withAuth: true,
			withErrorCatcher: true,
			onlyDev: false
		}
	) =>
	(request: any) => {
		let fnCallStack = fn;

		options.withAuth && (fnCallStack = withAuth(fnCallStack));
		options.withErrorCatcher && (fnCallStack = withErrorCatcher(fnCallStack));
		options.onlyDev && (fnCallStack = withOnlyDev(fnCallStack));

		return fnCallStack(request);
	};
