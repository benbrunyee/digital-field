import handlebars from 'handlebars';

export async function generateHtml(template: string, data: any) {
	const templateFn = handlebars.compile(template);
	const html = templateFn(data);
	return html;
}
