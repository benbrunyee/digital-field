<script lang="ts">
	import { isDisplayField, isInputField } from '$lib/FormCreator/util/isFieldType';
	import type { EntryState } from '../FormCreator/types/formTypes';
	import { initializeEntryStore } from './stores/entry';
	import { getFormStore } from './stores/form';

	export let formId: string;
	export let entryId: string | undefined = undefined;

	const form = getFormStore();

	// TODO: Types for entry state
	const entry = initializeEntryStore<EntryState>(formId);

	$: entryId && entry.setEntryId(entryId);
	$: formId && form.setFormId(formId);
</script>

<div class="card bg-surface-50-900-token m-2 p-2">
	{#if !$form}
		<span class="text-error-500-400-token">Could not find form</span>
	{:else}
		<div class="space-y-2">
			{#each $form.fields as field}
				{#if field}
					<div class="space-y-1">
						<div class="ml-2">
							{#if isInputField(field)}
								<label for="input-{field.id}">
									{field.name}
								</label>
							{:else if isDisplayField(field)}
								<label for="input-{field.id}">
									{field.value}
								</label>
							{/if}
						</div>

						<input
							class="input"
							name="input-{field.id}"
							on:input={(e) => {
								// We don't bind because the element isn't guaranteed to exist in the entry
								entry.setFieldValue(field.id, e.currentTarget.value);
							}}
						/>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
