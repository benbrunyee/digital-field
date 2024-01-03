<script lang="ts" context="module">
	export const navigation = [
		{
			name: 'Homepage',
			path: '/'
		},
		{
			name: 'Forms',
			path: '/forms'
		}
	] as const;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { pageTitle } from '../stores/pageTitle';

	const drawerStore = getDrawerStore();

	function drawerClose() {
		drawerStore.close();
	}

	function setPageTitle(title: string) {
		$pageTitle = title;
	}
</script>

<nav class="list-nav h-full border-r border-neutral-400 p-4">
	<ul>
		{#each navigation as navItem}
			<li>
				<a
					href={navItem.path}
					on:click={() => {
						drawerClose();
						setPageTitle(navItem.name);
					}}
					data-active={$page.url.pathname === navItem.path ||
						$page.url.pathname.startsWith(navItem.path + '/')}
					class="data-[active=true]:bg-surface-50-900-token data-[active=true]:text-primary-500"
					>{navItem.name}</a
				>
			</li>
		{/each}
	</ul>
</nav>
