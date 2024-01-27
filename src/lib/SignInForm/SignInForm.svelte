<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo-black.png';
	import { auth, googleAuthProvider } from '$lib/firebase';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { toastError } from '../util/toast/toastNotifications';

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let termsAccepted = false;
	let error = {
		type: '',
		message: ''
	};
	let isSubmitting = false;
	let state = writable<{
		currentStep: number;
		type: 'sign-in' | 'sign-up';
	}>({
		currentStep: 0,
		type: 'sign-up'
	});

	const signIn = async (email: string, password: string) => {
		if (!email && !password) {
			error.type = 'email-password';
			error.message = 'Please enter an email and password';
			return;
		} else if (!email) {
			error.type = 'email';
			error.message = 'Please enter an email';
			return;
		} else if (!password) {
			error.type = 'password';
			error.message = 'Please enter a password';
			return;
		}

		isSubmitting = true;

		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto('/app/');
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign in');
		}

		isSubmitting = false;
	};

	const signUp = async (email: string, password: string) => {
		if (!termsAccepted) {
			error.type = 'terms';
			error.message = 'Please accept the terms and conditions';
			return;
		}

		if (!email && !password) {
			error.type = 'email-password';
			error.message = 'Please enter an email and password';
			return;
		} else if (!email) {
			error.type = 'email';
			error.message = 'Please enter an email';
			return;
		} else if (!password) {
			error.type = 'password';
			error.message = 'Please enter a password';
			return;
		}

		isSubmitting = true;

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			goto('/app/');
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign up');
		}

		isSubmitting = false;
	};

	const signUpWithGoogle = async () => {
		isSubmitting = true;

		try {
			await signInWithPopup(auth, googleAuthProvider);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign up with Google');
		}

		isSubmitting = false;
	};

	const resetError = () => {
		error.type = '';
		error.message = '';
	};
</script>

<div>
	{#if $state.type === 'sign-up'}
		<div class="space-y-16">
			<div class="flex items-center justify-between">
				<img src={logo} alt="Logo" class="w-28" />

				<p class="text-right text-sm">
					Already have an account?
					<button
						on:click={() => {
							$state.type = 'sign-in';
							$state.currentStep = 0;
							resetError();
						}}
						class="text-primary-500-400-token font-bold">Sign In</button
					>
				</p>
			</div>

			<div class="relative mx-auto w-2/3">
				<div class="relative z-10 flex justify-between">
					<div>
						<span
							class="badge {$state.currentStep === 0
								? 'variant-filled-primary'
								: 'variant-filled-surface'}">{$state.currentStep === 0 ? 'Step ' : ''} 1</span
						>
					</div>

					<div>
						<span
							class="badge transition-transform {$state.currentStep === 1
								? 'variant-filled-primary'
								: 'variant-filled-surface'}">{$state.currentStep === 1 ? 'Step ' : ''}2</span
						>
					</div>
				</div>

				<hr class="-translate-y-1/ absolute left-1/2 top-1/2 w-full -translate-x-1/2" />
			</div>

			<div>
				{#if $state.currentStep === 0}
					<h2 class="mb-16 text-3xl">Let's create your account</h2>
					<form>
						<div class="space-y-4">
							<div class="space-y-2">
								<input
									bind:value={email}
									type="email"
									placeholder="johnsmith@google.com"
									class="input variant-ringed"
									class:input-error={error.type === 'email' || error.type === 'email-password'}
									disabled={isSubmitting}
									autocomplete="email"
									on:focus={() => resetError()}
								/>
								<input
									bind:value={password}
									type="password"
									placeholder="********"
									class="input variant-ringed"
									class:input-error={error.type === 'password' || error.type === 'email-password'}
									disabled={isSubmitting}
									autocomplete="new-password"
									on:focus={() => resetError()}
								/>
								<label class="ml-2 flex items-center space-x-2">
									<input
										bind:value={termsAccepted}
										type="checkbox"
										class="checkbox"
										class:input-error={error.type === 'terms'}
										on:focus={() => resetError()}
									/>
									<span class="text-surface-400-500-token ml-2 text-sm">
										By signing up, you agree to our <a
											href="/privacy-policy"
											target="_blank"
											class="text-primary-500-400-token font-bold">Privacy Policy</a
										>
										and
										<a
											href="/terms-and-conditions"
											target="_blank"
											class="text-primary-500-400-token font-bold">Terms & Conditions</a
										>
									</span>
								</label>
							</div>

							{#if error.message}
								<p class="text-error-500-400-token" in:slide out:slide>{error.message}</p>
							{/if}
						</div>

						<div class="mt-12 flex items-stretch space-x-2">
							<div class="relative">
								<div class="flex items-stretch space-x-2">
									<button
										disabled={isSubmitting}
										on:click={() => signUpWithGoogle()}
										class="variant-ringed btn btn-icon"
									>
										<span>
											<Icon icon="logos:google-icon" />
										</span>
									</button>
									<button
										disabled={isSubmitting}
										on:click={() => signUpWithGoogle()}
										class="variant-ringed btn btn-icon"
									>
										<span>
											<Icon icon="logos:facebook" />
										</span>
									</button>
									<button
										disabled={isSubmitting}
										on:click={() => signUpWithGoogle()}
										class="variant-ringed btn btn-icon"
									>
										<span>
											<Icon icon="logos:linkedin-icon" />
										</span>
									</button>
								</div>

								<span
									class="text-surface-400-500-token absolute bottom-0 left-1/2 w-full -translate-x-1/2 translate-y-full pt-1 text-center font-['Caveat']"
									>Or use one of us!</span
								>
							</div>

							<hr class="divider-vertical h-auto" />

							<button
								disabled={isSubmitting}
								on:click={() => signUp(email, password)}
								class="variant-filled-primary btn"
								><span>Next</span>
								<span>
									<Icon icon="mdi:arrow-right" />
								</span>
							</button>
						</div>
					</form>
				{:else if $state.currentStep === 1}
					<button
						on:click={() => {
							$state.currentStep--;
						}}>Go Back</button
					>
				{/if}
			</div>

			<button class="text-primary-500-400-token float-right text-sm font-bold" on:click={() => {}}
				>Having problems?</button
			>
		</div>
	{:else if $state.type === 'sign-in'}
		<div class="space-y-16">
			<div class="flex items-center justify-between">
				<img src={logo} alt="Logo" class="w-28" />

				<p class="text-right text-sm">
					Don't have an account?
					<button
						on:click={() => {
							$state.type = 'sign-up';
							$state.currentStep = 0;
							resetError();
						}}
						class="text-primary-500-400-token font-bold">Sign Up</button
					>
				</p>
			</div>

			<form>
				<h2 class="mb-16 text-3xl">Sign into your account</h2>

				<div class="space-y-4">
					<div class="space-y-2">
						<input
							bind:value={email}
							type="email"
							placeholder="johnsmith@google.com"
							class="input variant-ringed"
							class:input-error={error.type === 'email' || error.type === 'email-password'}
							disabled={isSubmitting}
							autocomplete="email"
							on:focus={() => resetError()}
						/>
						<input
							bind:value={password}
							type="password"
							placeholder="********"
							class="input variant-ringed"
							class:input-error={error.type === 'password' || error.type === 'email-password'}
							disabled={isSubmitting}
							autocomplete="new-password"
							on:focus={() => resetError()}
						/>
					</div>

					{#if error.message}
						<p class="text-error-500-400-token" in:slide out:slide>{error.message}</p>
					{/if}
				</div>

				<div class="mt-12 flex items-stretch space-x-2">
					<button
						disabled={isSubmitting}
						on:click={() => signUpWithGoogle()}
						class="variant-ringed btn btn-icon"
					>
						<span>
							<Icon icon="logos:google-icon" />
						</span>
					</button>
					<button
						disabled={isSubmitting}
						on:click={() => signUpWithGoogle()}
						class="variant-ringed btn btn-icon"
					>
						<span>
							<Icon icon="logos:facebook" />
						</span>
					</button>
					<button
						disabled={isSubmitting}
						on:click={() => signUpWithGoogle()}
						class="variant-ringed btn btn-icon"
					>
						<span>
							<Icon icon="logos:linkedin-icon" />
						</span>
					</button>

					<hr class="divider-vertical h-auto" />

					<button
						disabled={isSubmitting}
						on:click={() => signIn(email, password)}
						class="variant-filled-primary btn"
						><span>Sign In</span>
						<span>
							<Icon icon="mdi:arrow-right" />
						</span>
					</button>
				</div>
			</form>

			<button class="text-primary-500-400-token float-right text-sm font-bold" on:click={() => {}}
				>Having problems?</button
			>
		</div>
	{/if}
</div>
