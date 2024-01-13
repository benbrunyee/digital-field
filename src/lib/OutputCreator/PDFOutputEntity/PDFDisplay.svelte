<script lang="ts">
	import { page } from '$app/stores';
	import PDFObject from 'pdfobject';

	let html = '';

	function pdfDisplay(node: HTMLDivElement) {
		const binaryString = atob($page.data.pdf);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));

		console.log($page.data.pdf);

		// Random unique ID that starts with a letter
		node.id = 'pdf-' + Math.random().toString(36).substring(2, 9);

		PDFObject.embed(url, `#${node.id}`, {
			supportRedirect: true
		});
	}
</script>

<div class="flex flex-1 lg:w-2/3">
	<div use:pdfDisplay class="flex-auto"></div>
</div>
