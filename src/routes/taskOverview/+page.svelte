<script lang="ts">
	import { onMount } from 'svelte';
	import { tasks, tasksSearchTerm, tasksFiltered, showFinishedTasks } from '$lib/Stores/TaskStore';
	import moment from 'moment';
	import { sort_by } from '$lib/utils/generalHelpers';
	import { Card, Modal } from 'stwui';
	import toast, { Toaster } from 'svelte-french-toast';
	import { io } from '$lib/realtime';

	import NewTask from '$lib/NewTask.svelte';
	import UpdateTask from '$lib/UpdateTask.svelte';
	import TaskRow from './TaskRow.svelte';

	let openModal = false;
	let isUpdateTaskOpen = false;
	let isDeleteConfirmationOpen = false;
	let UpdateTaskValues: Array<String | Number | Date> = [];
	let sortSelected = 'dueAt';
	let sortOnce = true;
	let searchQuery = '';
	let user_id: String;
	let idToDelete: Number | null;

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

	function openUpdateTask(event) {
		const task = event.detail.task;
		isUpdateTaskOpen = true;
		UpdateTaskValues = [task.id, task.name, task.dueAt, task.additional_information, task.status];
	}

	function closeUpdateTask() {
		isUpdateTaskOpen = false;
	}

	async function getCurrentTasks() {
		const response = await fetch('/api/getUserTasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id
			})
		});
		const result = await response.json();
		return result;
	}

	function createTasks(data) {
		if (data !== 'Not found') {
			$tasks = data.map((i) => {
				return {
					name: i.task,
					dueAt: new Date(i.dueAt.replace(' ', 'T')),
					additional_information: i.additional_information,
					status: i.status,
					id: i.id,
					is_finished: i.is_finished,
					amount_of_comments: i.amount_of_comments
				};
			});
		} else {
			$tasks = [];
		}
		$tasks = $tasks.sort(sort_by('dueAt', false));
	}

	function sortTasks(field, reverse: Boolean, primer) {
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
	async function getAndCreateTasks() {
		createTasks(await getCurrentTasks());
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

	function toggleDeletion(event) {
		idToDelete = event.detail.id;
		toggleDeleteConfirmation();
	}

	async function finishTask(event) {
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

	async function updateTask(updateID, updateStatus, updateName, updateDueAt, updateExtras) {
		fetch('/api/updateUserTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: updateID,
				status: updateStatus,
				task: updateName,
				dueAt: moment(updateDueAt).format('YYYY-MM-DD'),
				additional_information: updateExtras
			})
		}).then((response) => {
			response.json;
			io.emit('database-change');
			getAndCreateTasks();
		});
	}

	function updateTaskFromModal(event) {
		let id, name, dueAt, extra, status;
		[id, name, dueAt, extra, status] = event.detail.values;
		updateTask(id, status, name, dueAt, extra);
	}

	function toggleDeleteConfirmation() {
		isDeleteConfirmationOpen = !isDeleteConfirmationOpen;
	}
</script>

<Toaster />
<button
	on:click={toggleNewTask}
	type="button"
	class="absolute bottom-10 right-10 h-20 w-20 rounded-[50%] bg-blue-500 text-4xl text-white transition-all hover:scale-105 hover:bg-blue-500"
	>+</button
>
<div class="my-0 mx-auto flex w-10/12 flex-col justify-center pt-10">
	<!-- <div class="my-3"><HackerHeading text="Aufträge" /></div> -->
	<div class="mb-5 mt-0">
		Abgeschlossene Aufträge anzeigen
		<input type="checkbox" bind:checked={$showFinishedTasks} class="cursor-pointer" />
	</div>

	<div class="relative z-0 pb-5">
		<input
			type="text"
			id="floating_standard"
			class="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
			placeholder=" "
			bind:value={searchQuery}
		/>
		<label
			for="floating_standard"
			class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
			>Filter...</label
		>
	</div>

	{#if openModal}
		<NewTask
			on:toggle={toggleNewTask}
			on:fetchTasks={getAndCreateTasks}
			on:createToast={() => toast.success('Auftrag erfolgreich erstellt!')}
		/>
	{/if}
	{#if isUpdateTaskOpen}
		<UpdateTask
			on:toggle={closeUpdateTask}
			on:taskUpdate={updateTaskFromModal}
			updateValues={UpdateTaskValues}
			on:createToast={() => toast.success('Auftrag erfolgreich bearbeitet!')}
		/>
	{/if}
	{#if isDeleteConfirmationOpen}
		<Modal handleClose={toggleDeleteConfirmation}>
			<Modal.Content slot="content">
				<Card>
					<Card.Header slot="header">Wirklich löschen?</Card.Header>
					<Card.Content slot="content">
						<p class="mb-4 text-base">
							Der Auftrag "{$tasks.find((item) => item.id === idToDelete).name}" wird gelöscht!
						</p>
						<button
							on:click={toggleDeleteConfirmation}
							class="buttonstyle bg-blue-600 hover:bg-blue-500">Bitte abbrechen!</button
						>
						<button on:click={deleteTask} class="buttonstyle bg-red-700  hover:bg-red-600"
							>Ja, wirklich löschen!</button
						>
					</Card.Content>
				</Card>
			</Modal.Content>
		</Modal>
	{/if}
	{#if $tasks !== undefined}
		<table class="max-w-full">
			<thead>
				<tr class="text-left">
					<th on:click={() => sortTasks('name', false, (a) => a.toUpperCase())}
						>Aufträge<i
							class:caret-down={sortSelected === 'name' && sortOnce}
							class:caret-up={sortSelected === 'name' && !sortOnce}
						/></th
					>
					<th on:click={() => sortTasks('dueAt', false)}
						>Datum<i
							class:caret-down={sortSelected === 'dueAt' && sortOnce}
							class:caret-up={sortSelected === 'dueAt' && !sortOnce}
						/></th
					>
					<th on:click={() => sortTasks('status', false, (a) => a.toUpperCase())}
						>Status<i
							class:caret-down={sortSelected === 'status' && sortOnce}
							class:caret-up={sortSelected === 'status' && !sortOnce}
						/></th
					>
					<th on:click={() => sortTasks('additional_information', false, (a) => a.toUpperCase())}
						>Zusätzliches<i
							class:caret-down={sortSelected === 'additional_information' && sortOnce}
							class:caret-up={sortSelected === 'additional_information' && !sortOnce}
						/></th
					>
					<th>Optionen</th>
				</tr>
			</thead>
			<tbody>
				{#each $tasksFiltered as task}
					<TaskRow
						{task}
						on:deleteTask={toggleDeletion}
						on:finishTask={finishTask}
						on:updateTask={updateTaskFromModal}
						on:openUpdateTask={openUpdateTask}
					/>
				{/each}
			</tbody>
		</table>
	{:else}
		<h1>Loading Data</h1>
	{/if}
</div>

<style lang="scss">
	$background-color: #edf0f1;
	$accent-color: rgb(37 99 235);

	table {
		font-size: 20px;
		background-color: $background-color;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		border-collapse: collapse;
		color: white;
	}

	th {
		padding: 25px 55px;
		padding-left: 10px;
		text-align: left;
		cursor: pointer;
		transition: all 0.3s ease 0s;
		&:last-child {
			cursor: default;
		}
		&:first-child {
			padding-left: 30px;
		}
		&:hover {
			color: $background-color;
		}
	}
	thead {
		box-shadow: 0 3px 6px #00000030;
		background-color: $accent-color;
	}
	tbody {
		color: #202e39;
	}

	.caret-down {
		position: relative;
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			border-top: 30px solid white;
			border-left: 30px solid transparent;
			border-right: 30px solid transparent;
			transform: scale(0.4);
		}
		&:after {
			content: '';
			position: absolute;
			left: 1px;
			top: 0;
			border-top: 29px solid white;
			border-left: 29px solid transparent;
			border-right: 29px solid transparent;
			transform: scale(0.4);
		}
	}
	.caret-up {
		position: relative;
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			border-bottom: 30px solid white;
			border-left: 30px solid transparent;
			border-right: 30px solid transparent;
			transform: scale(0.4);
		}
		&:after {
			content: '';
			position: absolute;
			left: 1px;
			top: 0;
			border-bottom: 29px solid white;
			border-left: 29px solid transparent;
			border-right: 29px solid transparent;
			transform: scale(0.4);
		}
	}

	.buttonstyle {
		@apply rounded px-3 py-2 text-sm text-white transition-colors;
	}
</style>
