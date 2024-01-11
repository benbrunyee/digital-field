<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
</script>

<div
	class="border-surface-400-500-token flex flex-row items-center space-x-2 border border-dashed px-4 py-2 rounded-token"
>
	<Icon {icon} class="h-4 w-4" />
	<span>
		<slot />
	</span>
</div>
