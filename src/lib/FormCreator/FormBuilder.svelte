<script lang="ts">
	import FormField from './FormFields/FormField.svelte';
	import type { Form } from './types/formTypes';

	export let form: Form;

	$: console.log(form);
</script>

<div class="bg-surface-50-900-token space-y-2 p-4 rounded-token lg:w-3/5">
	<input bind:value={form.name} placeholder="Form Name" class="input variant-glass text-2xl" />
	<div class="space-y-2">
		{#each form.fields as field}
			<FormField bind:field />
		{/each}
	</div>
</div>
