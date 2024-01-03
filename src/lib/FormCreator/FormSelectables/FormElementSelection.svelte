<script lang="ts">
	import { displayElementTypes, fieldTypes } from '../types/fieldTypes';
	import FormSelectableElement from './FormSelectableElement.svelte';
</script>

{#each fieldTypes as type}
	<FormSelectableElement {type} />
{/each}

<hr />
<h3 class="h3">Display Elements</h3>

{#each displayElementTypes as type}
	<FormSelectableElement {type} />
{/each}
