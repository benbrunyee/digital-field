import { readInputFileTemplate } from '$lib/server/defaultHandlebarTemplates/inputFields/util/readInputFieldTemplate.js';
import { generateHtml } from '$lib/server/util/generateHtml.js';
import { htmlToPdf } from '$lib/server/util/htmlToPdf.js';

export async function load({ params }) {
	const template = await readInputFileTemplate('text');

	const html = await generateHtml(template, {
		item_ref: {
			value: 'Test'
		}
	});

	const pdf = await htmlToPdf(html);

	return {
		pdf
	};
}
