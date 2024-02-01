<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	export const previousPageStore = writable('/');
</script>

<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { orgIdStore } from '$lib/stores/org';
	import '../app.pcss';
	import { navigation } from '../lib/Navigation/Navigation.svelte';
	import { pageTitle } from '../lib/Navigation/stores/pageTitle';

	afterNavigate(({ from }) => {
		$previousPageStore = from?.url.pathname || $previousPageStore;

		navigation($orgIdStore).forEach((navItem) => {
			if (
				navItem.path === $page.url.pathname ||
				$page.url.pathname.startsWith(navItem.path + '/')
			) {
				$pageTitle = navItem.name;
			}
		});
	});
</script>

<slot />
