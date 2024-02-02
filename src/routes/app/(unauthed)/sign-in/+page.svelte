<script lang="ts">
	import SignInForm from '$lib/SignInForm/SignInForm.svelte';
	import logo from '$lib/assets/images/logo-black.png';
	import { orgIdStore } from '$lib/stores/org';
	import { XPro } from '@skeletonlabs/skeleton';

	orgIdStore.set('');
</script>

<XPro />

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="card flex w-3/5 overflow-hidden bg-[#FFFFF1] shadow-2xl">
		<div class="flex basis-1/2 flex-col items-center justify-center px-16 py-12">
			<SignInForm />
		</div>
		<div
			class="relative flex basis-1/2 items-center justify-center self-stretch overflow-hidden bg-primary-500 bg-cover shadow-inner"
		>
			<img src={logo} alt="Logo" class="w-56" />
		</div>
	</div>
</div>
