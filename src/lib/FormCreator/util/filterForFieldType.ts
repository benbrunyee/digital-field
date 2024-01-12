import type { AllFieldsI } from '../../SelectableElements/types/fieldTypes';
import { allFormFieldTypes, type InputField, type InputFieldType } from '../types/fieldTypes';

export function filterForInputField(field: AllFieldsI): field is InputField<InputFieldType> {
	return allFormFieldTypes.includes(field.type as InputFieldType);
}
