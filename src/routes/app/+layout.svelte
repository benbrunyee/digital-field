<script>
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/LoadingSpinner/LoadingSpinner.svelte';
	import { auth, functions } from '$lib/firebase';
	import { toastError, toastSuccess } from '$lib/util/toast/toastNotifications';
	import { onSignIn } from '$lib/util/user/onSignIn';
	import { onSignOut } from '$lib/util/user/onSignOut';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		Accordion,
		AccordionItem,
		Toast,
		getToastStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import { onAuthStateChanged } from 'firebase/auth';
	import { httpsCallable } from 'firebase/functions';
	import { onMount } from 'svelte';
	import { displayFieldTypes, inputFieldTypes } from '../../lib/FormCreator/types/fieldTypes';
	import { isInputFieldType } from '../../lib/FormCreator/util/isFieldType';
	import { orgIdStore } from '../../lib/stores/org';
	import {
		createDisplayFieldStructure,
		createInputFieldStructure
	} from '../../lib/util/form/createFields';
	import { createFormStructure, saveFormDoc } from '../../lib/util/form/createForm';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	const toastStore = getToastStore();

	let isLoading = true;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			isLoading = false;

			if (!user) {
				// User is signed out
				onSignOut();
			} else {
				// User is signed in
				try {
					await onSignIn();
				} catch (e) {
					console.error(e);
					toastError(toastStore, 'Failed to load user data');
				}
			}
		});
	});
</script>

<Toast />

{#if import.meta.env.DEV}
	<div
		class="card absolute bottom-5 left-5 flex min-w-60 flex-col items-center space-y-2 rounded-md bg-white p-4 shadow-2xl"
	>
		<Accordion>
			<AccordionItem>
				<svelte:fragment slot="summary">
					<span class="font-bold">Dev controls</span>
				</svelte:fragment>
				<svelte:fragment slot="content">
					<div class="flex flex-col space-y-1">
						<button
							class="variant-filled-primary btn"
							on:click={() => {
								httpsCallable(functions, 'createUserRoles')()
									.then(() => {
										toastSuccess(toastStore, 'User roles created');
									})
									.catch((error) => {
										console.error(error);
										toastError(toastStore, 'Failed to create user roles');
									});
							}}>Create User Roles</button
						>
						<button
							class="variant-filled-primary btn"
							on:click={() => {
								new Promise(async (resolve) => {
									const form = createFormStructure('Field Survey');

									const fields = [...inputFieldTypes, ...displayFieldTypes].map((type) => {
										if (isInputFieldType(type)) {
											return createInputFieldStructure(type);
										} else {
											return createDisplayFieldStructure(type);
										}
									});

									form.fields = fields;

									try {
										await saveFormDoc(form);
										toastSuccess(toastStore, 'Created form');
										await goto(`/app/org/${$orgIdStore}/forms`);
									} catch (e) {
										console.error(e);
										toastError(toastStore, 'Failed to create form');
									}

									return resolve(true);
								});
							}}>Create Filled Form</button
						>
					</div>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
{/if}

{#if isLoading}
	<div class="flex h-screen items-center justify-center">
		<LoadingSpinner />
	</div>
{:else}
	<slot />
{/if}
