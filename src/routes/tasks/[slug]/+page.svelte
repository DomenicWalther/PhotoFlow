<script lang="ts">
	import TaskRow from './TaskRow.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	export let data: PageData;
	let comment: String;
	let isEditingComment: Boolean = false;
	let editingCommentId: String = '';
	let editingCommentContent: String;

	const submitComment = async () => {
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

	const deleteComment = (comment_id: String) => {
		fetch('/api/deleteCommentFromTask', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				comment_id: comment_id
			})
		}).then((response) => {
			invalidateAll();
		});
	};

	const editComment = (comment) => {
		isEditingComment = true;
		editingCommentId = comment.id;
		editingCommentContent = comment.comment;
	};

	const editCommentReset = () => {
		isEditingComment = false;
		editingCommentId = '';
		editingCommentContent = '';
	};

	const editCommentSave = () => {
		fetch('/api/updateCommentFromTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				new_comment: editingCommentContent,
				comment_id: editingCommentId
			})
		}).then((response) => {
			invalidateAll();
			editCommentReset();
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
			<TaskRow label="Category" data={data.tasks?.additional_information} isDark />
			<TaskRow label="Status" data={data.tasks?.status} />
			<TaskRow
				label="Due At"
				data={new Date(data.tasks?.dueAt).toLocaleDateString('de-DE', dateOptions)}
				isDark
			/>

			<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<div class="max-w-lg ">
					<form on:submit|preventDefault={submitComment} class="w-full p-4">
						<label class="mb-2 block">
							<span class="text-gray-600">Add a comment</span>
							<textarea class="mt-1 block w-full rounded" rows="3" bind:value={comment} />
						</label>
						<button class="buttonstyle">Comment</button>
					</form>
				</div>
			</div>

			<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt class="text-m mt-1 text-gray-900">Activity</dt>
			</div>
			{#if data.comments}
				{#each data.comments as comment}
					<div class="sm:gapx-4 bg-gray-50 py-3 px-4 sm:grid sm:grid-cols-3 sm:px-6">
						<dt class="text-sm font-medium text-gray-500">
							{new Date(comment.created_at).toLocaleDateString('de-DE', dateOptions)}
							{new Date(comment.created_at).toLocaleTimeString('de-DE', {
								hour: '2-digit',
								minute: '2-digit'
							})}
						</dt>
						{#if editingCommentId !== comment.id}
							<dd class="mt-1 px-20 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
								{comment.comment}
							</dd>
						{:else if isEditingComment && editingCommentId === comment.id}
							<div>
								<textarea
									rows="2"
									class="mt-1 w-full rounded sm:col-span-2 sm:mt-0"
									bind:value={editingCommentContent}
								/>
								<div class="flex justify-start">
									<button class="buttonstyle mx-2 sm:mt-0" on:click={editCommentSave}>Save</button>
									<button class="buttonstyle mx-2 sm:mt-0" on:click={editCommentReset}
										>Cancel</button
									>
								</div>
							</div>
						{/if}
						{#if !isEditingComment}
							<div class="flex">
								<p
									class="optiontext cursor-pointer underline"
									on:click={() => editComment(comment)}
								>
									Edit
								</p>
								<p class="optiontext px-1">-</p>
								<p
									on:click={() => deleteComment(comment.id)}
									class="optiontext cursor-pointer underline"
								>
									Delete
								</p>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</dl>
	</div>
</div>

<style lang="postcss">
	.optiontext {
		@apply text-xs font-medium text-gray-800;
	}

	.buttonstyle {
		@apply rounded bg-blue-600 px-3 py-2 text-sm text-blue-100;
	}
</style>
