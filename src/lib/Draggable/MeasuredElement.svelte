<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher();

	$: top = element?.getBoundingClientRect().top;
	$: bottom = element?.getBoundingClientRect().bottom;

	$: dispatch('measure', { top, bottom });
</script>

<div {...$$restProps} bind:this={element}>
	<slot />
</div>
