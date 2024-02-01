<script lang="ts">
	import type { DisplayFieldType } from '../../FormCreator/types/fieldTypes';

	export let text: string;
	export let type: DisplayFieldType;
</script>

{#if type === 'paragraph'}
	<p class="p">{text}</p>
{:else if type === 'subheading'}
	<h3 class="h3">{text}</h3>
{:else if type === 'heading'}
	<h2 class="h2">{text}</h2>
{:else if type === 'separator'}
	<hr class="!border-surface-900-50-token my-2" />
{/if}
