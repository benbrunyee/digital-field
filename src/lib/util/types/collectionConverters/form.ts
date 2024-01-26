import type { DocumentData } from 'firebase/firestore';
import { existingFormSchema, type ExistingForm } from '../../../FormCreator/types/formTypes';

export const parseExistingForm = (form: DocumentData): ExistingForm => {
	const existingFormParsed = existingFormSchema.parse(form);
	return existingFormParsed;
};
