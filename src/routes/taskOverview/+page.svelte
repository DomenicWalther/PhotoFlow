<script lang="ts">

	import { onMount } from 'svelte';

	import { tasks, tasksSearchTerm, tasksFiltered, showFinishedTasks } from '$lib/Stores/TaskStore';

	import { sort_by, updateCreateTask } from '$lib/utils/generalHelpers';

	import { Card, Modal } from 'stwui';

	import toast, { Toaster } from 'svelte-french-toast';

	import { io } from '$lib/realtime';

	import { getAndCreateTasks } from '$lib/utils/tasks';

	import TaskModal from '$lib/components/TaskModal.svelte';

	import TaskRow from './TaskRow.svelte';

	import CalendarView from './CalendarView.svelte';

	import FloatingButtons from '$lib/components/FloatingButtons.svelte';

	import SearchFilter from '$lib/components/SearchFilter.svelte';

	import ViewToggle from '$lib/components/ViewToggle.svelte';

	import UploadCsv from '$lib/components/UploadCSV.svelte';

	import type { Task } from '$lib/types/Task';

	import TaskFilter from '$lib/components/TaskFilter.svelte';



	let openModal = false;

	let isUpdateTaskOpen = false;

	let isDeleteConfirmationOpen = false;

	let isSettingsModalOpen = false;

	let UpdateTaskValues: [number, string, Date, string, string, string] = [] as unknown as [number, string, Date, string, string, string];

	let sortSelected = 'dueAt';

	let sortOnce = true;

	let searchQuery = '';

	let idToDelete: number | null = null;

	let viewMode: 'table' | 'calendar' = 'table';

	let isFilterOpen = false;



	const ONEDAY = 86400000;

	$: tasksSearchTerm.set(searchQuery);



	onMount(async () => {

		getAndCreateTasks();

		io.on('database-changed', (...args) => {

			getAndCreateTasks();

		});

	});



	function toggleNewTask() {

		 openModal = !openModal;

	}



	function toggleSettingsModal() {

		isSettingsModalOpen = !isSettingsModalOpen;

	}



	function openUpdateTask(event: CustomEvent<{task: Task}>) {

		const task = event.detail.task;

		console.log('Opening task for update:', task);

		isUpdateTaskOpen = true;

		UpdateTaskValues = [

			task.id, 

			task.name, 

			task.dueAt, 

			task.additional_information, 

			task.status,

			task.orderPath || ''

		];

	}



	function updateTaskFromModal(event: CustomEvent<{values: [number, string, Date, string, string, string]}>) {

		const [id, name, dueAt, extra, status, orderPath] = event.detail.values;

		console.log('Updating task with values:', { id, name, dueAt, extra, status, orderPath });

		updateCreateTask(id, status, name, dueAt, extra, orderPath);

		toast.success('Auftrag aktualisiert!');

	}



	function closeUpdateTask() {

		isUpdateTaskOpen = false;

	}



	function sortTasks(field: keyof Task, reverse: boolean, primer?: (a: any) => any) {

		if (sortSelected === field) {

			if (sortOnce) {

				reverse = !reverse;

			}

			sortOnce = !sortOnce;

		} else {

			sortOnce = true;

		}

		$tasks = $tasks.sort(sort_by(field, reverse, primer));

		sortSelected = field;

	}



	async function deleteTask() {

		fetch('/api/deleteUserTask', {

			method: 'DELETE',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({

				task_id: idToDelete

			})

		}).then((response) => {

			getAndCreateTasks();

			idToDelete = null;

			toggleDeleteConfirmation();

			toast.success('Auftrag gelöscht!');

			response.json();

			io.emit('database-change');

		});

	}



	async function importDatabase(file) {

		fetch('/api/importcsv', {

			method: 'Post',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({

				file

			})

		}).then((response) => {

			toast.success('Aufträge importiert!');

			getAndCreateTasks();

			io.emit('database-change');

		});

	}



	function toggleDeletion(event: CustomEvent<{id: number}>) {

		idToDelete = event.detail.id;

		toggleDeleteConfirmation();

	}



	function finishTask(event: CustomEvent<{id: number}>) {

		fetch('/api/finishUserTask', {

			method: 'POST',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({

				id: event.detail.id

			})

		}).then((response) => {

			getAndCreateTasks();

			toast.success('Auftrag abgeschlossen!');

			response.json();

			io.emit('database-change');

		});

	}



	function toggleDeleteConfirmation() {

		isDeleteConfirmationOpen = !isDeleteConfirmationOpen;

	}



	function arrayToCsv(data: (string | number | boolean)[][]) {

		return data

			.map((row) =>

				row

					.map(String)

					.map((v) => v.replaceAll('"', '""'))

					.map((v) => `"${v}"`)

					.join(',')

			)

			.join('\r\n');

	}



	function getData() {

		return arrayToCsv([

			['ID', 'task', 'dueAt', 'status', 'additional_information', 'is_finished', 'taskColumn'],

			...$tasks.map((task) => [

				task.id,

				task.name,

				task.dueAt,

				task.status,

				task.additional_information,

				task.is_finished,

				task.taskColumn

			])

		]);

	}



	function downloadBlob(content: string, filename: string, contentType: string) {

		const blob = new Blob([content], { type: contentType });

		const url = URL.createObjectURL(blob);



		const a = document.createElement('a');

		document.body.append(a);

		a.href = url;

		a.setAttribute('download', filename);

		a.click();

		a.remove();

	}

	function toggleSettings() {

		toggleSettingsModal();

	}

</script>



<Toaster />



<FloatingButtons 

	handleNewTask={toggleNewTask}

	handleSettings={toggleSettings}

/>



<div class="my-0 mx-auto flex w-10/12 flex-col justify-center pt-10">

	<SearchFilter bind:searchQuery />



	<div class="mb-4 flex justify-between items-center">

		<button

			on:click={() => isFilterOpen = !isFilterOpen}

			class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"

			>

			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">

				<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />

			</svg>

			Filter {isFilterOpen ? 'ausblenden' : 'anzeigen'}

		</button>

	</div>



	<TaskFilter bind:isOpen={isFilterOpen} />



	<ViewToggle bind:viewMode />



	{#if openModal}

		<TaskModal on:toggleModal={toggleNewTask} />

	{/if}

	{#if isUpdateTaskOpen}

		<TaskModal

			completionDate={UpdateTaskValues[2]}

			taskName={UpdateTaskValues[1]}

			taskDescription={UpdateTaskValues[3]}

			status={UpdateTaskValues[4]}

			taskID={UpdateTaskValues[0]}

			orderPath={UpdateTaskValues[5]}

			on:toggleModal={closeUpdateTask}

		/>

	{/if}

	{#if isDeleteConfirmationOpen}

		<Modal handleClose={toggleDeleteConfirmation}>

			<Modal.Content slot="content">

				<Card>

					<Card.Header slot="header" class="bg-red-500 text-white p-4 text-lg font-semibold rounded-t-lg">

						Wirklich löschen?

					</Card.Header>

					<Card.Content slot="content" class="p-6">

						<p class="mb-6 text-gray-700">

							Der Auftrag "{$tasks.find((item) => item.id === idToDelete)?.name}" wird gelöscht!

						</p>

						<div class="flex justify-end gap-3">

							<button

								on:click={toggleDeleteConfirmation}

								class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"

							>

								Abbrechen

							</button>

							<button 

								on:click={deleteTask} 

								class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"

							>

								Löschen

							</button>

						</div>

					</Card.Content>

				</Card>

			</Modal.Content>

		</Modal>

	{/if}

	{#if isSettingsModalOpen}

		<Modal handleClose={toggleSettingsModal}>

			<Modal.Content slot="content">

				<Card>

					<Card.Header slot="header" class="bg-blue-500 text-white p-4 text-lg font-semibold rounded-t-lg">

						Einstellungen

					</Card.Header>

					<Card.Content slot="content" class="p-6">

						<div class="flex flex-col gap-6">

							<div class="flex items-center justify-between">

								<UploadCsv onUpload={(file) => importDatabase(file)} />

								<button

									class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"

									on:click={() => downloadBlob(getData(), 'export.csv', 'text/csv;charset=utf-8')}

								>

									Aufträge Exportieren

								</button>

							</div>

						</div>

					</Card.Content>

				</Card>

			</Modal.Content>

		</Modal>

	{/if}

	{#if $tasks !== undefined}

		{#if viewMode === 'table'}

			<div class="overflow-x-auto rounded-lg">

				<table class="mb-24 w-full">

					<thead>

						<tr>

							<th class="sortable" on:click={() => sortTasks('name', false, (a) => a.toUpperCase())}>

								Aufträge

								<i class:caret-down={sortSelected === 'name' && sortOnce}

								   class:caret-up={sortSelected === 'name' && !sortOnce} />

							</th>

							<th class="sortable" on:click={() => sortTasks('dueAt', false)}>

								Datum

								<i class:caret-down={sortSelected === 'dueAt' && sortOnce}

								   class:caret-up={sortSelected === 'dueAt' && !sortOnce} />

							</th>

							<th class="sortable" on:click={() => sortTasks('status', false, (a) => a.toUpperCase())}>

								Status

								<i class:caret-down={sortSelected === 'status' && sortOnce}

								   class:caret-up={sortSelected === 'status' && !sortOnce} />

							</th>

							<th class="sortable" on:click={() => sortTasks('additional_information', false, (a) => a.toUpperCase())}>

								Zusätzliches

								<i class:caret-down={sortSelected === 'additional_information' && sortOnce}

								   class:caret-up={sortSelected === 'additional_information' && !sortOnce} />

							</th>

							<th>Optionen</th>

						</tr>

					</thead>

					<tbody>

						{#each $tasksFiltered as task}

							<TaskRow

								{task}

								isUrgent={Math.floor((new Date(task.dueAt).getTime() - Date.now()) / ONEDAY) < 1 &&

									task.is_finished === false}

								on:deleteTask={toggleDeletion}

								on:finishTask={finishTask}

								on:updateTask={updateTaskFromModal}

								on:openUpdateTask={openUpdateTask}

							/>

						{/each}

					</tbody>

				</table>

			</div>

		{:else}

			<CalendarView 

				tasks={$tasksFiltered} 

				on:openUpdateTask={openUpdateTask}

			/>

		{/if}

	{:else}

		<h1>Loading Data</h1>

	{/if}

</div>



<style lang="scss">

	$background-color: #ffffff;

	$accent-color: rgb(37 99 235);

	$hover-color: #f8fafc;

	$border-color: #e2e8f0;



	table {

		font-size: 16px;

		background-color: $background-color;

		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

		border-collapse: separate;

		border-spacing: 0;

		border-radius: 8px;

		width: 100%;

		color: #1e293b;

		overflow: hidden;

	}



	th {

		padding: 16px 24px;

		text-align: left;

		cursor: pointer;

		transition: all 0.2s ease;

		color: white;

		font-weight: 600;

		position: relative;

		

		&:last-child {

			cursor: default;

		}



		&:hover:not(:last-child) {

			background-color: darken($accent-color, 5%);

		}



		&.sortable::after {

			content: '↕';

			position: absolute;

			right: 8px;

			opacity: 0.5;

		}

	}



	thead {

		background-color: $accent-color;

		

		tr {

			height: 60px;

		}

	}



	tbody {

		tr {

			border-bottom: 1px solid $border-color;

			transition: all 0.2s ease;



			&:hover {

				background-color: $hover-color;

			}



			&:last-child {

				border-bottom: none;

			}

		}



		td {

			padding: 16px 24px;

			color: #475569;

			

			&:first-child {

				font-weight: 500;

				color: #1e293b;

			}

		}

	}



	.caret-down, .caret-up {

		position: relative;

		padding-right: 24px;



		&::after {

			content: '';

			position: absolute;

			right: 8px;

			top: 50%;

			border-left: 5px solid transparent;

			border-right: 5px solid transparent;

			transform: translateY(-50%);

		}

	}



	.caret-down::after {

		border-top: 5px solid white;

	}



	.caret-up::after {

		border-bottom: 5px solid white;

	}



	.urgent {

		background-color: #fee2e2;

		

		td {

			color: #991b1b;

		}



		&:hover {

			background-color: #fecaca;

		}

	}



	@media (max-width: 1024px) {

		table {

			font-size: 14px;

		}



		th, td {

			padding: 12px 16px;

		}

	}



	.buttonstyle {

		@apply rounded-md px-4 py-2 text-sm font-medium text-white transition-colors;

		

		&:hover {

			@apply opacity-90;

		}

	}

</style>


