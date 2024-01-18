<script lang="ts">
	import { page } from '$app/stores';
	import EntryCreator from '$lib/EntryCreator/EntryCreator.svelte';
</script>

<EntryCreator formId={$page.params.formId} />
