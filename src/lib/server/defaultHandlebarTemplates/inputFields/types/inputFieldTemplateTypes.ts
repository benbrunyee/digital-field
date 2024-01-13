import type { InputFieldType } from '../../../../FormCreator/types/fieldTypes';

export const inputFieldTypeToTemplate: { [key in InputFieldType]: string } = {
	text: 'text.handlebars',
	number: 'number.handlebars',
	checkbox: 'checkbox.handlebars',
	file: 'file.handlebars',
	date: 'date.handlebars',
	time: 'time.handlebars',
	'multi-entry': 'multiEntry.handlebars',
	address: 'address.handlebars',
	audio: 'audio.handlebars',
	choice: 'choice.handlebars',
	link: 'link.handlebars',
	multiple_choice: 'multipleChoice.handlebars',
	signature: 'signature.handlebars',
	video: 'video.handlebars',
	image: 'image.handlebars'
};
