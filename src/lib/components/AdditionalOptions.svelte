<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleClickOutside() {
		dispatch('clicked_outside');
	}

	export let options: {
		label: string;
		icon?: new (...args: any[]) => SvelteComponent;
		disabled: boolean;
		onClick: () => void;
	};
</script>

<ul
	class="absolute left-8 top-0 rounded-lg shadow-lg"
	use:clickOutside
	on:click_outside={handleClickOutside}
>
	{#each options as option}
		{#if !option.disabled}
			<li>
				<button
					class="flex w-full gap-x-2 p-4 text-base font-bold transition-all hover:text-blue-500"
					on:click={option.onClick}
				>
					{#if option.icon}
						<svelte:component this={option.icon} />
					{/if}
					{option.label}
				</button>
			</li>
		{/if}
	{/each}
</ul>

<style>
	ul {
		background-color: #edf0f1;
	}
</style>
