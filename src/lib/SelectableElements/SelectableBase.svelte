<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let tooltip = true;
	const id =
		'selectable-' +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);

	const popupHover: PopupSettings = {
		event: 'hover',
		target: `popupHover-${id}`,
		placement: 'right'
	};
</script>

<div
	class="group bg-surface-50-900-token border-surface-300-600-token flex cursor-pointer select-none flex-nowrap items-center justify-between p-2 px-4 border-token rounded-token {$$props.class}"
>
	<div class="flex items-center space-x-1">
		<slot name="icon" />
		<span class="text-sm group-hover:text-primary-500"><slot /></span>
	</div>
	{#if tooltip}
		<div use:popup={popupHover} class="[&>*]:pointer-events-none">
			<Icon icon="material-symbols:info-outline-rounded" class="ml-auto h-4 w-4" />
		</div>
		<div data-popup="popupHover-{id}" class="card bg-surface-800-100-token p-2">
			<p class="text-surface-100-800-token text-xs">
				<slot name="tooltip" />
			</p>
		</div>
	{/if}
</div>
