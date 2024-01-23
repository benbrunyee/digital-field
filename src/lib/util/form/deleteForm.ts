import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../../firebase';

export const deleteFormDoc = (formId: string) => {
	return deleteDoc(doc(firestore, 'forms', formId));
};
