export const withOnlyDev = (fn: (request: any) => any) => (request: any) => {
	if (process.env.FUNCTIONS_EMULATOR) {
		return fn(request);
	} else {
		throw new Error('This function is only available in the development environment');
	}
};
