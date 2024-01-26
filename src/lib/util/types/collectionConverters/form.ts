import { existingFormSchema, type ExistingForm } from '../../../FormCreator/types/formTypes';
import { convertFirestoreTimestamps } from '../convertFirestoreTimestamp';

export const parseExistingForm = (form: any): ExistingForm => {
	const dateFields: (keyof Partial<ExistingForm>)[] = ['createdAt', 'updatedAt'];
	const existingFormParsed = existingFormSchema.parse(convertFirestoreTimestamps(form, dateFields));
	return existingFormParsed;
};
