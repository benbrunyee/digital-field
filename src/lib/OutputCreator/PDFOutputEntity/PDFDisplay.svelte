<script lang="ts">
	import PDFObject from 'pdfobject';

	function pdfDisplay(node: HTMLDivElement) {
		// Random unique ID that starts with a letter
		node.id = 'pdf-' + Math.random().toString(36).substring(2, 9);

		PDFObject.embed('/sample-3pp.pdf', `#${node.id}`, {
			supportRedirect: true
		});
	}
</script>

<div class="flex flex-1 lg:w-2/3">
	<div use:pdfDisplay class="flex-auto"></div>
</div>
