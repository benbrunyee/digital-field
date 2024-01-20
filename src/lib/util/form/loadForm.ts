import { doc, getDoc } from 'firebase/firestore';
import { existingFormSchema } from '../../FormCreator/types/formTypes';
import { firestore } from '../../firebase';

export const loadForm = async (id: string) => {
	const formDoc = await getDoc(doc(firestore, 'forms', id));

	if (!formDoc.exists()) {
		throw new Error('Form does not exist');
	}

	const formData = formDoc.data();

	const formDataParsed = existingFormSchema.parse(formData);

	return formDataParsed;
};
