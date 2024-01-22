<script lang="ts">
	import SignInForm from '$lib/SignInForm/SignInForm.svelte';
	import { orgIdStore } from '$lib/stores/org';

	orgIdStore.set('');
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="card space-y-2 p-4">
		<SignInForm />
	</div>
</div>
