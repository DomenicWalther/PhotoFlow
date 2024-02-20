<script lang="ts">
	interface Comment {
		id: Number;
		comment: String;
		created_at: Date;
	}
	interface Data {
		tasks: Tasks;
		comments: Comment[];
	}
	export let data: Data;
	export let comment: Comment;
	import { invalidateAll } from '$app/navigation';
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	let isEditingComment: Boolean = false;
	let editingCommentContent: String;
	let editingCommentId: String = '';

	const deleteComment = (comment_id: Number) => {
		fetch('/api/deleteCommentFromTask', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				comment_id: comment_id,
				task_id: data.tasks?.id
			})
		}).then((response) => {
			invalidateAll();
		});
	};

	const editComment = (comment: Comment) => {
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
				<button class="buttonstyle mx-2 sm:mt-0" on:click={editCommentReset}>Cancel</button>
			</div>
		</div>
	{/if}
	{#if !isEditingComment}
		<div class="flex">
			<p class="optiontext cursor-pointer underline" on:click={() => editComment(comment)}>
				Bearbeiten
			</p>
			<p class="optiontext px-1">-</p>
			<p on:click={() => deleteComment(comment.id)} class="optiontext cursor-pointer underline">
				Löschen
			</p>
		</div>
	{/if}
</div>
