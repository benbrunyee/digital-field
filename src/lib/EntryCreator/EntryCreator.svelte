<script lang="ts">
	import {
		isExistingDisplayField,
		isExistingInputField,
		isInputField
	} from '$lib/FormCreator/util/isFieldType';
	import { initializeEntryStore } from './stores/entry';
	import { getFormStore } from './stores/form';

	export let formId: string;
	export let entryId: string | undefined = undefined;

	const form = getFormStore();

	// TODO: Types for entry state
	const entry = initializeEntryStore(formId);

	$: entryId && entry.setEntryId(entryId);
	$: formId && form.setFormId(formId);

	const saveEntry = async () => {};
</script>

<div class="card bg-surface-50-900-token m-2 p-2">
	{#if !$form}
		<span class="text-error-500-400-token">Could not find form</span>
	{:else}
		<div class="space-y-2">
			{#each $form.fields as field}
				{#if field}
					{@const fieldObj = {
						id:
							isExistingInputField(field) || isExistingDisplayField(field)
								? field.id
								: field.clientId,
						value: isInputField(field) ? field.name : field.value
					}}

					<div class="space-y-1">
						<div class="ml-2">
							<label for="input-{fieldObj.id}">
								{fieldObj.value}
							</label>
						</div>

						<input
							class="input"
							name="input-{fieldObj.id}"
							on:input={(e) => {
								// We don't bind because the element isn't guaranteed to exist in the entry
								entry.setFieldValue(fieldObj.id, e.currentTarget.value);
							}}
						/>
					</div>
				{/if}
			{/each}

			<button class="variant-filled-primary btn" on:click={() => saveEntry()}>
				Create Entry
			</button>
		</div>
	{/if}
</div>
