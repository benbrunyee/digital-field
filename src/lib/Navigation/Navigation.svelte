<script lang="ts" context="module">
	export const navigation = (orgId: string) =>
		[
			{
				name: 'Homepage',
				path: `/app/org/${orgId}`
			},
			{
				name: 'Forms',
				path: `/app/org/${orgId}/forms`
			}
		] as const;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { orgIdStore } from '../stores/org';
	import { pageTitle } from './stores/pageTitle';

	const drawerStore = getDrawerStore();

	function drawerClose() {
		drawerStore.close();
	}

	function setPageTitle(title: string) {
		$pageTitle = title;
	}
</script>

<nav class="list-nav h-full p-4">
	<ul>
		{#each navigation($orgIdStore) as navItem}
			<li>
				<a
					href={navItem.path}
					on:click={() => {
						drawerClose();
						setPageTitle(navItem.name);
					}}
					data-active={$page.url.pathname === navItem.path}
					class="data-[active=true]:bg-surface-50-900-token data-[active=true]:text-primary-500"
					>{navItem.name}</a
				>
			</li>
		{/each}
	</ul>
</nav>
