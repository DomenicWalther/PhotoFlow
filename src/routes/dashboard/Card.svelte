<script lang="ts">
	export let taskHeading: String;
	export let taskDescription: String;
	export let taskTimeLeft: String | undefined = undefined;
</script>

<div class="mt-5 min-w-fit rounded-md bg-white px-10 py-6 shadow-sm">
	<h4 class="pb-5 text-gray-800">{taskHeading}</h4>
	<p class="text-sm text-gray-700">
		{taskDescription}
	</p>
	{#if taskTimeLeft !== undefined}
		<div class="mt-4 flex w-full flex-row-reverse">
			<div
				class="flex w-fit rounded-lg bg-violet-100 px-4 py-2 text-right text-sm font-semibold text-violet-700"
			>
				{taskTimeLeft}
			</div>
		</div>
	{/if}
</div>
