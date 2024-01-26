<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ExistingEntry } from '$lib/EntryCreator/types/entryTypes';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { loadEntries } from '$lib/util/entry/loadEntry';
	import { onMount } from 'svelte';

	const formId = $page.params.formId;

	let entries: ExistingEntry[] = [];
	let isLoading = true;

	onMount(async () => {
		entries = await loadEntries(formId);
		isLoading = false;
	});
</script>

<div class="space-y-2">
	<button class="variant-filled-primary btn" on:click={() => goto('entries/create')}>
		Add Entry
	</button>

	<hr />

	{#if isLoading}
		<div class="flex items-center justify-center p-4">
			<LoadingSpinner />
		</div>
	{:else}
		<div class="space-y-1">
			{#each entries as entry}
				<div class="bg-surface-50-900-token rounded-md p-2">
					<a href="entries/{entry.id}" class="">
						<p class="text-sm italic">
							Updated on {entry.updatedAt.toDate().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
						<p class="text-sm italic">
							Created on {entry.createdAt.toDate().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
