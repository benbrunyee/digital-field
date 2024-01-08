<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher();
	let resizeObserver: ResizeObserver | undefined;

	let top = 0;
	let bottom = 0;

	onMount(() => {
		resizeObserver = new ResizeObserver((entries) => {
			top = entries[0].contentRect.top;
			bottom = entries[0].contentRect.bottom;
		});

		resizeObserver.observe(element);
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
	});

	$: dispatch('measure', { top, bottom });
</script>

<div {...$$restProps} bind:this={element}>
	<slot />
</div>
