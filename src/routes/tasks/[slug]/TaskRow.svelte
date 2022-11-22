<script lang="ts">
	export let label: String = '';
	export let data;
	export let isDark: boolean = false;
</script>

<div
	class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
	class:bg-gray-50={!isDark}
	class:bg-gray-200={isDark}
>
	<dt class="text-sm font-medium text-gray-500">{label}</dt>
	<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
		{data}
	</dd>
</div>
