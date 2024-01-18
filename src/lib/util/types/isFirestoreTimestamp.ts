import { Timestamp } from 'firebase/firestore';

export const isFirestoreTimestamp = (value: any): value is Timestamp => {
	console.log(value);
	return value instanceof Timestamp;
};
