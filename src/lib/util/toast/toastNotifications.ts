import { getToastStore } from '@skeletonlabs/skeleton';

export const toastError = (toastStore: ReturnType<typeof getToastStore>, error: string) => {
	toastStore.trigger({
		message: error,
		background: 'bg-error-400-500-token',
		classes: 'text-on-error-900-50-token'
	});
};

export const toastSuccess = (toastStore: ReturnType<typeof getToastStore>, message: string) => {
	toastStore.trigger({
		message,
		background: 'bg-success-400-500-token',
		classes: 'text-on-success-900-50-token'
	});
};
