<script lang="ts">
	export let taskHeading: String;
	export let taskDescription: String;
	export let taskTimeLeft: String | undefined = undefined;
	export let taskStatus: String;
	export let updateCard: () => void;
</script>

<div
	class="mt-3 min-w-fit rounded-md bg-white px-10 py-5 shadow-sm"
	on:click={updateCard}
	on:keydown={updateCard}
>
	<h4 class=" text-gray-800">{taskHeading}</h4>
	<div class="flex items-center justify-between">
		<p class="text-sm text-gray-700">
			{taskDescription}
		</p>
		<h1
			class="mr-5 {taskStatus === 'NichtBearbeitet'
				? 'text-gray-700'
				: taskStatus === 'Entwickelt'
				? 'text-red-700'
				: taskStatus === 'Retuschiert'
				? 'text-yellow-500'
				: taskStatus === 'Gedruckt'
				? 'text-green-600'
				: ''}"
		>
			&#x2022
		</h1>
	</div>

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
