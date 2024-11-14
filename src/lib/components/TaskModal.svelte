<script lang="ts">

	import { Card, Modal } from 'stwui';

	import { createEventDispatcher } from 'svelte';

	import { getAndCreateTasks } from '$lib/utils/tasks';

	import { updateCreateTask } from '$lib/utils/generalHelpers';

	import { onMount } from 'svelte';



	export let completionDate = new Date();

	export let taskName = "";

	export let taskDescription = "";

	export let status = "NichtBearbeitet";

	export let taskID: number | null = null;

	export let orderPath = "";



	const dispatch = createEventDispatcher();



	function toggleModal() {

		dispatch('toggleModal', {

			values: [

				taskID,

				taskName,

				completionDate,

				taskDescription,

				status,

				orderPath

			]

		});

	}



	const submitForm = async (event: Event) => {

		event.preventDefault();

		await updateCreateTask(

			taskID,

			status,

			taskName,

			completionDate,

			taskDescription,

			orderPath

		);

		toggleModal();

		getAndCreateTasks();

		// Reset form

		taskName = '';

		taskDescription = '';

		taskID = null;

		completionDate = new Date();

		orderPath = '';

	};



	let taskNameInput: HTMLInputElement;

	onMount(() => {
		taskNameInput?.focus();
	});

</script>



<Modal handleClose={toggleModal}>

	<Modal.Content slot="content">

		<Card>

			<Card.Header slot="header" class="bg-blue-500 text-white p-4 text-lg font-semibold rounded-t-lg">

				<div class="flex flex-row justify-between items-center">

					<div>{taskID ? 'Auftrag bearbeiten' : 'Neue Aufgabe hinzufügen'}</div>

					<button

						class="text-white hover:text-gray-200 transition-colors"

						on:click={toggleModal}

					>

						×

					</button>

				</div>

			</Card.Header>

			<Card.Content slot="content" class="p-6">

				<form on:submit|preventDefault={submitForm} class="space-y-4">

					<div>

						<label for="taskName" class="block text-sm font-medium text-gray-700 mb-1">

							Aufgabenname

						</label>

						<input

							type="text"

							id="taskName"

							placeholder="z.B. Hochzeit Familie Schmidt"

							class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

							bind:value={taskName}

							bind:this={taskNameInput}

							required

						/>

					</div>



					<div>

						<label for="task-description" class="block text-sm font-medium text-gray-700 mb-1">

							Beschreibung

						</label>

						<textarea

							name="description"

							id="task-description"

							placeholder="Zusätzliche Informationen zum Auftrag..."

							rows="4"

							class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

							bind:value={taskDescription}

						/>

					</div>



					<div class="grid grid-cols-2 gap-4">

						<div>

							<label for="completion-date" class="block text-sm font-medium text-gray-700 mb-1">

								Fertigstellung bis

							</label>

							<input

								type="date"

								id="completion-date"

								bind:value={completionDate}

								class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

							/>

						</div>



						<div>

							<label for="status" class="block text-sm font-medium text-gray-700 mb-1">

								Status

							</label>

							<select

								name="status"

								id="status"

								bind:value={status}

								class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

							>

								<option value="NichtBearbeitet">RAW</option>

								<option value="Entwickelt">Entwickelt</option>

								<option value="Retuschiert">Retuschiert</option>

								<option value="Gedruckt">Gedruckt</option>

							</select>

						</div>

					</div>



					<div class="mb-4">

						<label for="orderPath" class="block text-sm font-medium text-gray-700 mb-1">

							Ordner-Pfad (Optional)

						</label>

						<input

							type="text"

							id="orderPath"

							bind:value={orderPath}

							class="w-full p-2 border rounded-md"

							placeholder="Z:\Kunde\Auftrag"

						/>

					</div>



					<div class="flex justify-end gap-3 pt-4">

						<button

							type="button"

							class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"

							on:click={toggleModal}

						>

							Abbrechen

						</button>

						<button

							type="submit"

							class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"

						>

							{taskID ? 'Speichern' : 'Hinzufügen'}

						</button>

					</div>

				</form>

			</Card.Content>

		</Card>

	</Modal.Content>

</Modal>


