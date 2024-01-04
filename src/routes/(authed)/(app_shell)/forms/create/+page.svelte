<script>
	import FormBuilder from '$lib/FormCreator/FormBuilder.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let tab = 0;
</script>

<div class="flex flex-col items-center justify-center space-y-4">
	<RadioGroup>
		<RadioItem bind:group={tab} name="justify" value={0}>Input</RadioItem>
		<RadioItem bind:group={tab} name="justify" value={1}>Output</RadioItem>
	</RadioGroup>

	{#if tab === 0}
		<FormBuilder />
	{:else if tab === 1}
		<!-- TODO: Fill out -->
	{/if}
</div>
