<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, googleAuthProvider } from '$lib/firebase';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { toastError } from '../util/toast/toastError';

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let state: 'sign-in' | 'sign-up' = 'sign-in';
	let error = '';
	let isSubmitting = false;

	const signIn = async (email: string, password: string) => {
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
</script>

<div class="flex justify-around">
	<button class="btn" on:click={() => (state = 'sign-in')}>Sign In</button>
	<button class="btn" on:click={() => (state = 'sign-up')}>Sign Up</button>
</div>

<div class="space-y-2">
	<input bind:value={email} type="email" placeholder="Email" class="input" />
	<input bind:value={password} type="password" placeholder="Password" class="input" />
</div>

{#if error}
	<div class="text-center">
		<span class="text-error-500-400-token">{error}</span>
	</div>
{/if}

<div class="text-center">
	<button
		disabled={isSubmitting}
		on:click={() => (state === 'sign-in' ? signIn(email, password) : signUp(email, password))}
		class="variant-filled-primary btn">{state === 'sign-in' ? 'Sign In' : 'Sign Up'}</button
	>
	<button
		disabled={isSubmitting}
		on:click={() => signUpWithGoogle()}
		class="variant-filled-tertiary btn"
	>
		<span><Icon icon="mdi:google" /></span>
		<span>Sign Up with Google</span>
	</button>
</div>
