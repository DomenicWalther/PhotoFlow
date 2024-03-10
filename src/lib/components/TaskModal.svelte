<script lang="ts">
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';
	import type { PageData } from '../../routes/$types';
	import { getAndCreateTasks } from '$lib/utils/tasks';
	import { updateCreateTask } from '$lib/utils/generalHelpers';

	export let completionDate = new Date();
	export let taskName: String, taskDescription: String;
	export let column_id: number;
	export let buttonText: String = '+ Aufgabe hinzufügen';
	export let status: String;
	export let taskID: number | null = null;

	const dispatch = createEventDispatcher();

	function toggleModal() {
		dispatch('toggleModal');
	}

	const submitForm = async (event) => {
		await updateCreateTask(taskID, status, taskName, completionDate, taskDescription);
		toggleModal();
		getAndCreateTasks();

		event.target.reset();
		taskName = '';
		taskDescription = '';
    taskID = null;
		completionDate = new Date();
	};
</script>

<Modal handleClose={toggleModal}>
	<Modal.Content slot="content">
		<Card>
			<Card.Header slot="header">
				<div class="flex flex-row justify-between">
					<div class="font-bold">Neue Aufgabe hinzufügen</div>
					<button
						class="transition-color rounded-lg text-gray-400 hover:text-black"
						on:click={toggleModal}>✖</button
					>
				</div>
			</Card.Header>
			<Card.Content slot="content">
				<form on:submit|preventDefault={submitForm}>
					<div>
						<label for="taskName" class="text-sm font-semibold text-gray-700">Aufgabenname</label>
						<input
							type="text"
							id="taskName"
							placeholder="Redesign Homepage"
							class="mt-3 w-full rounded-lg border-gray-200 bg-gray-50 text-sm text-gray-600 placeholder:text-gray-400 focus:border-2 focus:border-blue-600"
							autofocus
							bind:value={taskName}
						/>
					</div>
					<div class="mt-3">
						<label for="task-description" class="text-sm font-semibold text-gray-700"
							>Gebe eine Beschreibung an:</label
						>
						<textarea
							name="description"
							id="task-description"
							placeholder="On line 672 you define $table_variants. Each instance of 'color-level' needs to be changed to 'shift-color'."
							cols="30"
							rows="5"
							class="mt-3 w-full rounded-lg border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 placeholder:text-gray-400 focus:border-2 focus:border-blue-600"
							bind:value={taskDescription}
						/>
					</div>
					<div>
						<input
							type="date"
							bind:value={completionDate}
							class="mt-3 rounded-lg border-gray-200 bg-gray-50"
						/>
						<select
							name="status"
							id="status"
							bind:value={status}
							class="mt-3 rounded-lg border-gray-200 bg-gray-50"
						>
							<option class="border-gray-200 bg-gray-50" value="NichtBearbeitet"
								>Nicht Bearbeitet</option
							>
							<option class="border-gray-200 bg-gray-50" value="Entwickelt">Entwickelt</option>
							<option class="border-gray-200 bg-gray-50" value="Retuschiert">Retuschiert</option>
							<option class="border-gray-200 bg-gray-50" value="Gedruckt">Gedruckt</option></select
						>
					</div>
					<hr class="mt-5 mb-3 w-full" />
					<div>
						<button
							type="submit"
							class="rounded-lg border-[1px] border-blue-600 bg-blue-600 px-7 py-[.625rem] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
							>{buttonText}</button
						>
						<button
							type="button"
							class="ml-3 rounded-lg border-[1px] border-gray-200 px-7 py-[.625rem] text-sm font-semibold text-gray-700 hover:bg-gray-50"
							on:click={toggleModal}>Schließen</button
						>
					</div>
				</form>
			</Card.Content>
		</Card>
	</Modal.Content>
</Modal>
