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

<div class="overflow-hidden bg-white pt-5 shadow sm:rounded-lg">
	<a href="/taskOverview" class="mt-5 py-5 px-4 text-sm font-medium leading-6 text-gray-900 sm:px-6"
		><button class="buttonstyle">Zurück zur Übersicht</button>
	</a>
	<div class="px-4 py-5 sm:px-6">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Kunden Informationen</h3>
		<p class="mt-1 max-w-2xl text-sm text-gray-500">Auftragsdetails</p>
	</div>
	<div class="border-t border-gray-200">
		<dl>
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

			<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<div class="max-w-lg ">
					<form on:submit|preventDefault={submitComment} class="w-full p-4">
						<label class="mb-2 block">
							<span class="text-gray-600">Füge einen Kommentar hinzu:</span>
							<textarea class="mt-1 block w-full rounded" rows="3" bind:value={comment} />
						</label>
						<button class="buttonstyle">Kommentieren</button>
					</form>
				</div>
			</div>

			<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt class="text-m mt-1 text-gray-900">Activity</dt>
			</div>
			{#if data.comments}
				{#each data.comments as comment}
					<Comment {comment} {data} />
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
		@apply rounded bg-blue-600 px-3 py-2 text-sm text-blue-100 transition-colors;
	}

	.buttonstyle:hover {
		@apply bg-blue-700 transition-colors;
	}
</style>
