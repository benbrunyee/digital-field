<script lang="ts">
	import { auth, googleAuthProvider } from '$lib/firebase';
	import Icon from '@iconify/svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithPopup
	} from 'firebase/auth';
	import { toastError } from '../util/toastError';

	const toastStore = getToastStore();

	let email = '';
	let password = '';
	let state: 'sign-in' | 'sign-up' = 'sign-in';
	let error = '';

	const signIn = async (email: string, password: string) => {
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign in');
		}
	};

	const signUp = async (email: string, password: string) => {
		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign up');
		}
	};

	const signUpWithGoogle = async () => {
		try {
			const credential = await signInWithPopup(auth, googleAuthProvider);
		} catch (e) {
			console.error(e);
			toastError(toastStore, 'Failed to sign up with Google');
		}
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
		on:click={() => (state === 'sign-in' ? signIn(email, password) : signUp(email, password))}
		class="variant-filled-primary btn">{state === 'sign-in' ? 'Sign In' : 'Sign Up'}</button
	>
	<button on:click={() => signUpWithGoogle()} class="variant-filled-tertiary btn">
		<span><Icon icon="mdi:google" /></span>
		<span>Sign Up with Google</span>
	</button>
</div>
