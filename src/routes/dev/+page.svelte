<script lang="ts">
	import { functions } from '$lib/firebase';
	import { httpsCallable } from 'firebase/functions';
</script>

<div class="flex min-h-screen flex-col items-center justify-center space-y-2">
	<button
		class="variant-outline-primary btn"
		on:click={() => {
			httpsCallable(functions, 'createUserRoles')();
		}}>Create User Roles</button
	>
</div>
