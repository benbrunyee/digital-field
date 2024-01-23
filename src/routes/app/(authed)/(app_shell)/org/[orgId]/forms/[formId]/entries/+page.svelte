<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { initializeEntriesStore } from '$lib/EntryCreator/stores/entries';

	const entries = initializeEntriesStore($page.params.formId);
</script>

<div>
	<button class="btn variant-filled-primary" on:click={() => goto('entries/create')}>
		Add Entry
	</button>

	<hr />

	{#each $entries as entry}
		<div>
			<a href="entries/{entry.id}">
				{entry.id}
			</a>
		</div>
	{/each}
</div>
