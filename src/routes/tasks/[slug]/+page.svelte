<script lang="ts">
	import TaskRow from './TaskRow.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	export let data: PageData;

	let comment: String;

	const submitComment = async (event) => {
		fetch('/api/addCommentToTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				task_id: data.tasks?.id,
				comment: comment
			})
		}).then((response) => {
			comment = '';
			invalidateAll();
		});
	};
</script>

<p />

<div class="overflow-hidden bg-white shadow sm:rounded-lg">
	<div class="px-4 py-5 sm:px-6">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Client Information</h3>
		<p class="mt-1 max-w-2xl text-sm text-gray-500">Task details</p>
	</div>
	<div class="border-t border-gray-200">
		<dl>
			<TaskRow
				label="Client Name"
				data={data.tasks?.task.charAt(0).toUpperCase() + data.tasks?.task.slice(1)}
			/>
			<TaskRow label="Category" data={data.tasks?.additional_information} />
			<TaskRow label="Status" data={data.tasks?.status} />
			<TaskRow label="Due At" data={data.tasks?.dueAt.toLocaleDateString('de-DE', dateOptions)} />

			<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<div class="max-w-lg ">
					<form on:submit|preventDefault={submitComment} class="w-full p-4">
						<label class="mb-2 block">
							<span class="text-gray-600">Add a comment</span>
							<textarea class="mt-1 block w-full rounded" rows="3" bind:value={comment} />
						</label>
						<button class="rounded bg-blue-600 px-3 py-2 text-sm text-blue-100">Comment</button>
					</form>
				</div>
			</div>

			<div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt class="text-m mt-1 text-gray-900">Activity</dt>
			</div>
			{#if data.comments}
				{#each data.comments as comment}
					<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">
							{comment.createdAt.toLocaleDateString('de-DE', dateOptions)}
							{comment.createdAt.toLocaleTimeString('de-DE', {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</dt>
						<dd class="mt-1 px-20 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{comment.comment}
						</dd>
					</div>
				{/each}
			{/if}
		</dl>
	</div>
</div>
