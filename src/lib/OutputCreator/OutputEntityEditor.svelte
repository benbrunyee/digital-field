<script>
	import PdfDisplay from './PDFOutputEntity/PDFDisplay.svelte';
	import PdfEditor from './PDFOutputEntity/PDFEditor.svelte';
	import { initializeOutputEntityStores } from './stores/outputEntity';

	// Set the context
	const outputEntity = initializeOutputEntityStores();
</script>

<div class="flex flex-auto self-stretch">
	<div class="flex flex-auto flex-row space-x-2">
		<PdfEditor />
		<PdfDisplay />
	</div>
</div>
