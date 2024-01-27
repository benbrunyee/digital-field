<script lang="ts">
	import { goto } from '$app/navigation';

	if (!import.meta.env.DEV) {
		goto('/app');
	}
</script>

<slot />
