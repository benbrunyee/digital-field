import type { AllFieldsI } from '../../SelectableElements/types/fieldTypes';
import { inputFieldTypes, type InputFieldI, type InputFieldType } from '../types/fieldTypes';

export function filterForInputField(field: AllFieldsI): field is InputFieldI<InputFieldType> {
	return inputFieldTypes.includes(field.type as InputFieldType);
}
