<script>
	import { setContext } from 'svelte';
	import PdfDisplay from '../PDFOutputEntity/PDFDisplay.svelte';
	import PdfEditor from '../PDFOutputEntity/PDFEditor.svelte';
	import { outputEntityStore } from '../stores/outputEntity';

	// Set the context
	const outputEntity = outputEntityStore();
	setContext('outputEntityStore', outputEntity);
</script>

<div class="flex flex-auto self-stretch">
	{#if $outputEntity.type === 'pdf'}
		<div class="flex flex-auto flex-row space-x-2">
			<PdfEditor />
			<PdfDisplay />
		</div>
	{/if}
</div>
