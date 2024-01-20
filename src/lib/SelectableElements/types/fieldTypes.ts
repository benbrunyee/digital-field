import type InputField from '../../FormCreator/FormFields/InputField.svelte';
import type { FormFieldTypes } from '../../FormCreator/types/fieldTypes';
import type { OutputField, OutputFieldType } from '../../OutputCreator/types/outputFieldTypes';

export type AllFields = InputField | OutputField;
export type AllFieldTypes = FormFieldTypes | OutputFieldType;
