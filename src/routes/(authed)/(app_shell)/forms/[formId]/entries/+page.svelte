<script lang="ts">
	import { page } from '$app/stores';
	import { initializeEntriesStore } from '$lib/EntryCreator/stores/entries';

	const entries = initializeEntriesStore($page.params.formId);
</script>

<div>
	{#each $entries as entry}
		<div>
			<a href="/forms/{$page.params.formId}/entries/{entry.id}">
				{entry.id}
			</a>
		</div>
	{/each}
</div>
