<script lang="ts">
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';
	import moment from 'moment';
	import type { PageData } from '../../routes/$types';

	let completionDate = new Date();
	let taskName: String, taskDescription: String;
	export let column_id;

	const dispatch = createEventDispatcher();

	function toggleModal() {
		dispatch('toggleModal');
	}

	const submitForm = async (event) => {
		fetch('/api/createNewCard', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				completion_Date: moment(completionDate).format('YYYY-MM-DD'),
				taskName: taskName,
				taskDescription: taskDescription,
				taskColumn: column_id
			})
		}).then((response) => {
			response.json();
			console.log(response);
		});
		toggleModal();

		event.target.reset();
		taskName = '';
		taskDescription = '';
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
					</div>
					<hr class="mt-5 mb-3 w-full" />
					<div>
						<button
							type="submit"
							class="rounded-lg border-[1px] border-blue-600 bg-blue-600 px-7 py-[.625rem] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
							>+ Aufgabe hinzufügen</button
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
