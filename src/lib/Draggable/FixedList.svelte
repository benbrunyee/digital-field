<script lang="ts" generics="T extends object | number | boolean | string">
	import Draggable from './Draggable.svelte';

	/**
	 * Slots:
	 * - draggedGhost: The ghost element that is shown when dragging an item
	 * - content: The content of each item
	 */

	export let items: T[];
</script>

<div
	class="space-y-2 {$$props.class ?? ''}"
	on:scroll={(e) => {
		console.log(e);
	}}
>
	{#each items as item}
		<Draggable payload={item}>
			<slot name="content" {item} />

			<svelte:fragment slot="draggedGhost">
				<slot name="draggedGhost" {item} />
			</svelte:fragment>
		</Draggable>
	{/each}
</div>
