<script lang="ts">
	import { displayFieldTypes, inputFieldTypes } from '../types/fieldTypes';
	import FormSelectableElement from './FormSelectableElement.svelte';
</script>

{#each inputFieldTypes as type}
	<FormSelectableElement {type} />
{/each}

<hr />
<h3 class="h3">Display Elements</h3>

{#each displayFieldTypes as type}
	<FormSelectableElement {type} />
{/each}
