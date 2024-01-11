<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	let element: HTMLDivElement;

	const dispatch = createEventDispatcher();
	let resizeObserver: ResizeObserver | undefined;

	let top = 0;
	let bottom = 0;

	onMount(() => {
		resizeObserver = new ResizeObserver((entries) => {
			const boundingRect = element.getBoundingClientRect();

			top = boundingRect.top;
			bottom = boundingRect.bottom;
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
