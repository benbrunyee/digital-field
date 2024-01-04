<script lang="ts">
	import { AccordionItem } from '@skeletonlabs/skeleton';

	export let name: string;
</script>

<AccordionItem>
	<svelte:fragment slot="lead"><slot name="icon" /></svelte:fragment>
	<svelte:fragment slot="summary">
		<span>{name}</span>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">Name</div>
			<input type="text" bind:value={name} />
		</div>
		<slot />
	</svelte:fragment>
</AccordionItem>
