<script lang="ts">
	import { page } from '$app/stores';
	import PDFObject from 'pdfobject';
	import { getContext } from 'svelte';
	import { type Writable } from 'svelte/store';
	import { createId } from '../../util/createId';

	const pdfStore = getContext<Writable<string>>('outputPdf');

	function pdfDisplay(node: HTMLDivElement) {
		if (!$pdfStore) {
			return;
		}

		const binaryString = atob($page.data.pdf);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));

		// Random unique ID that starts with a letter
		node.id = createId('pdf');

		PDFObject.embed(url, `#${node.id}`, {
			supportRedirect: true
		});
	}
</script>

<div class="flex flex-1 lg:w-2/3">
	<div use:pdfDisplay class="flex-auto"></div>
</div>
