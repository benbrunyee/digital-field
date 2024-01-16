import { getToastStore } from '@skeletonlabs/skeleton';

export const toastError = (toastStore: ReturnType<typeof getToastStore>, error: string) => {
	toastStore.trigger({
		message: error,
		background: 'bg-error-400-500-token'
	});
};
