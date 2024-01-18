import { Timestamp } from 'firebase/firestore';

export const isFirestoreTimestamp = (value: any): value is Timestamp => {
	return value instanceof Timestamp;
};
