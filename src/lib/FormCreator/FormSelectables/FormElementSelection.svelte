<script lang="ts">
	import { displayFieldTypes, inputFieldTypes } from '../types/fieldTypes';
	import FormSelectableElement from './FormSelectableElement.svelte';
</script>

<h3 class="h3 ml-2">Input Elements</h3>
<hr />

{#each inputFieldTypes as type}
	<FormSelectableElement {type} />
{/each}

<h3 class="h3 ml-2">Display Elements</h3>
<hr />

{#each displayFieldTypes as type}
	<FormSelectableElement {type} />
{/each}
