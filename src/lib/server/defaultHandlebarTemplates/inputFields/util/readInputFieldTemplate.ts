import { readFile } from 'fs/promises';
import { inputFieldTypeToTemplate } from '../types/inputFieldTemplateTypes';

export async function readInputFileTemplate(type: keyof typeof inputFieldTypeToTemplate) {
	if (!inputFieldTypeToTemplate[type]) {
		throw new Error(`No template found for input field type ${type}`);
	}

	const file = await readFile(
		`src/lib/server/defaultHandlebarTemplates/inputFields/${inputFieldTypeToTemplate[type]}`,
		'utf-8'
	);

	return file;
}
