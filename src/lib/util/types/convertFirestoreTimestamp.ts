import { isFirestoreTimestamp } from './isFirestoreTimestamp';

export const convertFirestoreTimestamps = <T extends object, K extends keyof Partial<T>>(
	data: T,
	dateFields: K[]
) => {
	const newObj = Object.assign<{}, any>({}, data);

	for (let key of dateFields) {
		const value = newObj?.[key];

		if (value && isFirestoreTimestamp(value)) {
			newObj[key] = value.toDate();
		}
	}

	return newObj;
};
