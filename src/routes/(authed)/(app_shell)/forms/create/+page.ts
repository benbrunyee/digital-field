
export function load({params}) {
	// const template = await readFile(
	// 	'$lib/templates/handlebarTemplates/defaultPdfTemplate.handlebars'
	// );
	// console.log(template.toString());

	return {
		html: `
			<div class="entry">
				<h1>{{ title }}</h1>
				<div class="body">{{ body }}</div>
			</div>
		`,
		test: ""
	};
};
