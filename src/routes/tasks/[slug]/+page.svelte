<script lang="ts">
	import TaskRow from './TaskRow.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import Comment from './Comment.svelte';
	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	export let data: PageData;
	let comment: String;

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
</script>

<div class="my-0 mx-auto flex w-10/12 flex-col justify-center pt-4">
	<div class="overflow-hidden bg-white shadow rounded-lg">
		<div class="flex justify-between items-center p-4 border-b border-gray-200">
			<a href="/taskOverview">
				<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200">
					Zurück zur Übersicht
				</button>
			</a>
		</div>

		<div class="px-6 py-5">
			<h3 class="text-lg font-medium text-gray-900">Kunden Informationen</h3>
			<p class="mt-1 text-sm text-gray-500">Auftragsdetails</p>
		</div>

		<dl class="divide-y divide-gray-200">
			<TaskRow
				label="Kundenname"
				data={data.tasks?.task.charAt(0).toUpperCase() + data.tasks?.task.slice(1)}
			/>
			<TaskRow label="Zusätzliche Informationen" data={data.tasks?.additional_information} isDark />
			<TaskRow label="Aktueller Status" data={data.tasks?.status} />
			<TaskRow
				label="Abholdatum"
				data={new Date(data.tasks?.dueAt).toLocaleDateString('de-DE', dateOptions)}
				isDark
			/>

			<div class="px-6 py-4 bg-gray-50">
				<form on:submit|preventDefault={submitComment} class="max-w-lg">
					<label class="block mb-2">
						<span class="text-gray-700">Füge einen Kommentar hinzu:</span>
						<textarea 
							class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
							rows="3" 
							bind:value={comment}
						/>
					</label>
					<button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200">
						Kommentieren
					</button>
				</form>
			</div>

			<div class="px-6 py-4">
				<h4 class="text-base font-medium text-gray-900">Activity</h4>
				{#if data.comments}
					{#each data.comments as comment}
						<Comment {comment} {data} />
					{/each}
				{/if}
			</div>
		</dl>
	</div>
</div>

<style>
	/* Remove existing styles as they're now handled by Tailwind classes */
</style>
