<script lang="ts">
	import { page } from '$app/stores';
	import Handlebars from 'handlebars';
	import PDFObject from 'pdfobject';
	import { onMount } from 'svelte';

	let html = '';

	function pdfDisplay(node: HTMLDivElement) {
		// Random unique ID that starts with a letter
		node.id = 'pdf-' + Math.random().toString(36).substring(2, 9);

		PDFObject.embed('/sample-3pp.pdf', `#${node.id}`, {
			supportRedirect: true
		});
	}

	onMount(() => {
		const source = $page.data.html;

		const template = Handlebars.compile(source);
		html = new Handlebars.SafeString(
			template({
				title: Handlebars.Utils.escapeExpression('My New Post'),
				body: Handlebars.Utils.escapeExpression('This is my first post!')
			})
		).toHTML();

		console.log(html);
	});
</script>

<div class="flex flex-1 lg:w-2/3">
	<div contenteditable bind:innerHTML={html}></div>
	<div use:pdfDisplay class="flex-auto"></div>
</div>
