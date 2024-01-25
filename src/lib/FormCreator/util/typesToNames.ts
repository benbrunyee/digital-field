import type { InputFieldType } from '../types/fieldTypes';

export const inputFieldTypeToName: {
	[k in InputFieldType]: string;
} = {
	'multi-entry': 'Multi Entry',
	address: 'Address',
	audio: 'Audio',
	checkbox: 'Checkbox',
	choice: 'Choice',
	date: 'Date',
	file: 'File',
	image: 'Image',
	link: 'Link',
	multiple_choice: 'Multiple Choice',
	number: 'Number',
	signature: 'Signature',
	text: 'Text',
	time: 'Time',
	video: 'Video'
};
