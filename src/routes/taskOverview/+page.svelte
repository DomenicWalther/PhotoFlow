<script lang="ts">

	import { onMount } from 'svelte';

	import { tasks, tasksSearchTerm, tasksFiltered, showFinishedTasks, tasksFilters } from '$lib/Stores/TaskStore';

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

	import type { FilterPreset } from '$lib/types/task';

	import TaskPriorityList from '$lib/components/TaskPriorityList.svelte';

	import TestDataGenerator from '$lib/components/TestDataGenerator.svelte';



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

	let startDate: Date | undefined;
	let endDate: Date | undefined;

	let activePreset: string | null = null;



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



	const filterPresets: FilterPreset[] = [

		{

			id: 'next7days',

			name: 'Nächste 7 Tage',

			filter: {

				dateRange: {

					start: new Date(),

					end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

				}

			}

		},

		{

			id: 'va-tasks',

			name: 'VA Aufträge',

			filter: {

				searchTerm: 'VA'

			}

		}

	];



	function applyPreset(preset: FilterPreset) {

		if (activePreset === preset.id) {

			searchQuery = '';

			startDate = undefined;

			endDate = undefined;

			activePreset = null;



			tasksFilters.update(filters => ({

				...filters,

				dateFrom: null,

				dateTo: null

			}));

			return;

		}



		activePreset = preset.id;



		if (preset.filter.searchTerm) {

			searchQuery = preset.filter.searchTerm;

		} else {

			searchQuery = '';

		}



		if (preset.filter.dateRange) {

			startDate = preset.filter.dateRange.start;

			endDate = preset.filter.dateRange.end;



			tasksFilters.update(filters => ({

				...filters,

				dateFrom: preset.filter.dateRange?.start || null,

				dateTo: preset.filter.dateRange?.end || null

			}));

		} else {

			startDate = undefined;

			endDate = undefined;



			tasksFilters.update(filters => ({

				...filters,

				dateFrom: null,

				dateTo: null

			}));

		}

	}

</script>



<Toaster />



<FloatingButtons 

	handleNewTask={toggleNewTask}

	handleSettings={toggleSettings}

/>



<div class="my-0 mx-auto flex w-10/12 flex-col justify-center pt-4">

	<div class="flex flex-wrap gap-4 items-center mb-2">

		<div class="flex-grow">

			<SearchFilter bind:searchQuery />

		</div>

		

		<div class="flex gap-2">

			{#each filterPresets as preset}

				<button

					class="px-3 py-1.5 {activePreset === preset.id 

						? 'bg-blue-500 text-white' 

						: 'bg-blue-100 hover:bg-blue-200 text-blue-700'} 

						rounded-md transition-colors duration-200 flex items-center gap-1 text-sm"

					on:click={() => applyPreset(preset)}

				>

					{#if preset.id === 'next7days'}

						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">

							<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />

						</svg>

					{:else if preset.id === 'va-tasks'}

						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">

							<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />

						</svg>

					{/if}

					{preset.name}

				</button>

			{/each}

		</div>



		<button

			on:click={() => isFilterOpen = !isFilterOpen}

			class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 text-sm"

		>

			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">

				<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />

			</svg>

			Filter {isFilterOpen ? 'ausblenden' : 'anzeigen'}

		</button>

	</div>



	<TaskFilter 

		bind:isOpen={isFilterOpen} 

		bind:startDate={startDate}

		bind:endDate={endDate}

		bind:searchQuery={searchQuery}

	/>



	<div class="flex justify-end mb-2">

		<ViewToggle bind:viewMode />

	</div>



	<div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">

		<div class="lg:col-span-3">

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

		</div>

		<div class="lg:col-span-1">

			<TaskPriorityList on:openUpdateTask={openUpdateTask}/>

		</div>

	</div>



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

							<div class="mt-4 pt-4 border-t">
								<TestDataGenerator />
							</div>

						</div>

					</Card.Content>

				</Card>

			</Modal.Content>

		</Modal>

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



	.presets {

		margin-bottom: 1rem;

	}



	.preset-buttons {

		display: flex;

		gap: 0.5rem;

		flex-wrap: wrap;

	}



	.preset-button {

		padding: 0.5rem 1rem;

		background-color: #f0f0f0;

		border: 1px solid #ddd;

		border-radius: 4px;

		cursor: pointer;

		transition: background-color 0.2s;

	}



	.preset-button:hover {

		background-color: #e0e0e0;

	}

</style>


