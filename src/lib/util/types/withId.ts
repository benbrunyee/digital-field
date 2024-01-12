import { createId } from '../createId';

export type WithId<T> = T & { id: string };

export const withId =
	<T>(opts?: { id?: string } | { prefix?: string }) =>
	(obj: T): WithId<T> => ({
		...obj,
		id:
			opts && 'id' in opts && opts?.id
				? opts.id
				: createId(opts && 'prefix' in opts ? opts.prefix : undefined)
	});
