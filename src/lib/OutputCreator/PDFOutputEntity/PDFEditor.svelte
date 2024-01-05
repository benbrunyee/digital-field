<script lang="ts">
	import { getContext } from 'svelte';
	import { outputEntityStore } from '../stores/outputEntity';

	const outputEntity = getContext<ReturnType<typeof outputEntityStore>>('outputEntityStore');
</script>

<div class="flex-1">
	<div class="bg-surface-50-900-token p-4 rounded-token"></div>
</div>
