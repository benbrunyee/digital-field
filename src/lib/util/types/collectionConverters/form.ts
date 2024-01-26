import { existingFormSchema, type ExistingForm } from '../../../FormCreator/types/formTypes';

export const parseExistingForm = (form: any): ExistingForm => {
	const existingFormParsed = existingFormSchema.parse(form);
	return existingFormParsed;
};
