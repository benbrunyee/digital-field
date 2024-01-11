<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const tabs = ['input', 'output'] as const;
	export const tab = writable<(typeof tabs)[number]>('input');
</script>

<script lang="ts">
	import FormBuilder from '$lib/FormCreator/FormBuilder.svelte';
	import OutputEntityEditor from '$lib/OutputCreator/OutputEntityEditor.svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-auto flex-col items-center space-y-4">
	<RadioGroup>
		<RadioItem bind:group={$tab} name="justify" value="input">Input</RadioItem>
		<RadioItem bind:group={$tab} name="justify" value="output">Output</RadioItem>
	</RadioGroup>

	{#if $tab === 'input'}
		<FormBuilder />
	{:else if $tab === 'output'}
		<OutputEntityEditor />
	{/if}
</div>
