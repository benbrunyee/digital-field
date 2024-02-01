<script lang="ts">
	import SignInForm from '$lib/SignInForm/SignInForm.svelte';
	import sideImage from '$lib/assets/images/login-image.png';
	import { orgIdStore } from '$lib/stores/org';
	import { XPro, filter } from '@skeletonlabs/skeleton';

	orgIdStore.set('');
</script>

<XPro />

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="card flex w-3/5 overflow-hidden bg-[#FFFFF1]">
		<div class="flex basis-1/2 flex-col items-center justify-center px-16 py-12">
			<SignInForm />
		</div>
		<div class="relative basis-1/2 self-stretch overflow-hidden bg-cover">
			<img
				src={sideImage}
				class="absolute left-1/2 top-1/2 h-full max-w-none -translate-x-1/2 -translate-y-1/2"
				alt="Field surveying"
				use:filter={'#XPro'}
			/>
		</div>
	</div>
</div>
