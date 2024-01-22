<script>
	import { initializeFormStore } from '$lib/FormCreator/stores/form';
	import FormEditorLayout from '$lib/Layouts/FormEditorLayout.svelte';

	initializeFormStore();
</script>

<FormEditorLayout>
	<slot />
</FormEditorLayout>
