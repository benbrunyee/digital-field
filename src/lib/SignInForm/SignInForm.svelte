<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo-black.png';
	import { auth, googleAuthProvider } from '$lib/firebase';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { doc, setDoc } from 'firebase/firestore';
	import { flip } from 'svelte/animate';
	import { spring } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import { fade, fly, slide } from 'svelte/transition';
	import { toastError } from '../util/toast/toastNotifications';
	import { ORG_COLLECTION } from '../util/types/collections';
	import { userStore } from '../util/user/stores/userStore';

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let orgName = '';
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
		currentStep: $page.url.searchParams.get('step') === '2' ? 1 : 0,
		type: 'sign-up'
	});
	let leftSpring = spring(0, {
		stiffness: 0.1,
		damping: 0.5
	});

	$: leftSpring.set($state.currentStep === 0 ? 0 : 100);

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
			$state.currentStep++;
		} catch (e) {
			console.error(e);

			const authError = e as any;

			if (authError.code === 'auth/email-already-in-use') {
				error.type = 'email';
				error.message = 'Email already in use';
			} else if (authError.code === 'auth/weak-password') {
				error.type = 'password';
				error.message = 'Password is too weak';
			} else if (authError.code === 'auth/network-request-failed') {
				error.type = 'network';
				error.message = 'Network error';
			}

			toastError(toastStore, 'Failed to sign up');
		}

		isSubmitting = false;
	};

	const signUpWithGoogle = async () => {
		isSubmitting = true;

		try {
			await signInWithPopup(auth, googleAuthProvider);
			$state.currentStep++;
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

	const updateOrgName = async () => {
		if (!$userStore.id || !$userStore.primaryOrgId) {
			error.type = 'auth';
			error.message = 'Please sign in';
			return;
		}

		if (!orgName) {
			error.type = 'orgName';
			error.message = 'Please enter an organisation name';
			return;
		}

		isSubmitting = true;

		try {
			await setDoc(
				doc(ORG_COLLECTION, $userStore.primaryOrgId),
				{
					name: orgName
				},
				{
					merge: true
				}
			);
			goto('/app/');
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to update organisation name');
		}

		isSubmitting = false;
	};
</script>

<div class="w-full md:h-[600px]">
	<div class="relative h-full w-full">
		{#if $state.type === 'sign-up'}
			<div class="absolute left-0 top-0 flex h-full w-full flex-col space-y-16" transition:fade>
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

				<div class="relative w-2/3 self-center">
					<div class="relative z-10 flex justify-between">
						{#each [0, 1] as step (step)}
							<span
								class="variant-filled-surface badge"
								class:variant-filled-primary={step === $state.currentStep}
								class:variant-filled-surface={step !== $state.currentStep}
								animate:flip
							>
								{$state.currentStep === step ? 'Step ' : ''}{step + 1}
							</span>
						{/each}
					</div>

					<hr class="-translate-y-1/ absolute left-1/2 top-1/2 w-full -translate-x-1/2" />

					<div
						class="variant-filled-primary absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
						style="left: calc({$leftSpring}% - {($leftSpring / 100) * 24}px);"
					></div>
				</div>

				<div class="relative">
					{#if $state.currentStep === 0}
						<div class="absolute" transition:fade>
							<h2 class="mb-16 text-3xl">Let's create your account</h2>
							<form>
								<div class="space-y-2">
									<input
										bind:value={email}
										type="text"
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
									<p class="text-error-500-400-token mt-4" transition:slide>{error.message}</p>
								{/if}

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
										on:click={() => {
											signUp(email, password);
										}}
										class="variant-filled-primary btn"
										><span>Next</span>
										<span>
											<Icon icon="mdi:arrow-right" />
										</span>
									</button>
								</div>
							</form>
						</div>
					{:else if $state.currentStep === 1}
						<div class="absolute" transition:fade>
							<h2 class="mb-16 text-3xl">Name your organisation</h2>

							<form>
								<div class="space-y-2">
									<input
										bind:value={orgName}
										type="text"
										placeholder="My Awesome Company"
										class="input variant-ringed"
										class:input-error={error.type === 'orgName'}
										disabled={isSubmitting}
										autocomplete="organization"
										on:focus={() => resetError()}
									/>
								</div>

								{#if error.message}
									<p class="text-error-500-400-token mt-4" transition:slide>{error.message}</p>
								{/if}

								<div class="mt-12 flex items-center space-x-2">
									<button
										class="variant-outline-primary btn"
										on:click={() => {
											$state.currentStep--;
										}}
									>
										<span><Icon icon="mdi:arrow-left" /></span>
										<span>Back</span>
									</button>

									<button
										class="variant-filled-primary btn"
										on:click={() => {
											updateOrgName();
										}}
									>
										<span>Continue</span>
										<span><Icon icon="mdi:arrow-right" /></span>
									</button>
								</div>
							</form>
						</div>
					{/if}
				</div>
				<div></div>
			</div>
		{:else if $state.type === 'sign-in'}
			<div class="absolute left-0 top-0 flex h-full flex-col justify-between" transition:fly>
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
							<p class="text-error-500-400-token" transition:slide>{error.message}</p>
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
				<div></div>
			</div>
		{/if}
	</div>
</div>

<div class="w-full text-right">
	<button class="text-primary-500-400-token text-sm font-bold" on:click={() => {}}
		>Having problems?</button
	>
</div>
