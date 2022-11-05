<script lang="ts">
	import { onMount } from 'svelte';
	import { tasks, tasksSearchTerm, tasksFiltered } from '$lib/store.js';
	import moment from 'moment';
	import { getUser } from '@lucia-auth/sveltekit/client';

	import NewTask from '$lib/NewTask.svelte';
	import UpdateTask from '$lib/UpdateTask.svelte';

	let openModal = false;
	let isUpdateTaskOpen = false;
	let UpdateTaskValues: Array<String | Number | Date> = [];
	let sortSelected = 'dueAt';
	let sortOnce = true;
	let searchQuery = '';

	const user = getUser();

	$: tasksSearchTerm.set(searchQuery);

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
	const sort_by = (field, reverse: Boolean | Number, primer: Function) => {
		const key = primer
			? function (x) {
					return primer(x[field]);
			  }
			: function (x: Object) {
					return x[field];
			  };

		reverse = !reverse ? 1 : -1;

		return function (a, b) {
			return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
		};
	};

	onMount(async () => {
		getAndCreateTasks();
	});

	function toggleNewTask() {
		openModal = !openModal;
	}

	function openUpdateTask(id, name, dueAt, additional_information, status) {
		isUpdateTaskOpen = true;
		UpdateTaskValues = [id, name, dueAt, additional_information, status];
	}

	function closeUpdateTask() {
		isUpdateTaskOpen = false;
	}

	async function getCurrentTasks() {
		const response = await fetch('/api/getUserTasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id: $user?.userId,
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
					id: i.id
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

	async function deleteTask(deleteID) {
		fetch('/api/deleteUserTask', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				task_id: deleteID
			})
		}).then((response) => {
			getAndCreateTasks();
			response.json();
		});
	}

	async function finishTask(finishID) {
		fetch('/api/finishUserTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({
				id: finishID
			})
		}).then((response) => {
				getAndCreateTasks();
				response.json()
			}) 
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
			getAndCreateTasks();
		});
	}

	function updateTaskFromModal(event) {
		let id, name, dueAt, extra, status;
		[id, name, dueAt, extra, status] = event.detail.values;
		updateTask(id, status, name, dueAt, extra);
	}
</script>

<div class="TaskManagement">
	<button on:click={toggleNewTask} type="button" class="neuer-auftrag">Neuer Auftrag</button>
	<input type="text" placeholder="Filter.." bind:value={searchQuery} />

	{#if openModal}
		<NewTask on:toggle={toggleNewTask} on:fetchTasks={getAndCreateTasks} />
	{/if}
	{#if isUpdateTaskOpen}
		<UpdateTask
			on:toggle={closeUpdateTask}
			on:taskUpdate={updateTaskFromModal}
			updateValues={UpdateTaskValues}
		/>
	{/if}
	{#if $tasks !== undefined}
		<table>
			<thead>
				<tr>
					<th on:click={() => sortTasks('name', false, (a) => a.toUpperCase())}
						>Familie<i
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
					<tr>
						<td>{task.name}</td>
						<td>{task.dueAt.toLocaleDateString('de-DE', dateOptions)}</td>
						<td
							><select
								name="status"
								id="status"
								bind:value={task.status}
								on:change={() =>
									updateTask(
										task.id,
										task.status,
										task.name,
										task.dueAt,
										task.additional_information
									)}
							>
								<option value="NichtBearbeitet">Nicht Bearbeitet</option>
								<option value="Entwickelt" selected="selected">Entwickelt</option>
								<option value="Retuschiert">Retuschiert</option>
								<option value="Gedruckt">Gedruckt</option>
							</select></td
						>
						<td>{task.additional_information === null ? '' : task.additional_information}</td>
						<td
							><button on:click={() => deleteTask(task.id)}>Delete</button><br /><button
								on:click={() =>
									openUpdateTask(
										task.id,
										task.name,
										task.dueAt,
										task.additional_information,
										task.status
									)}>Edit</button
							>
							<button on:click={() => finishTask(task.id)}>Finish</button></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<h1>Loading Data</h1>
	{/if}
</div>

<style lang="scss">
	$background-color: #edf0f1;
	$accent-color: rgba(0, 136, 169, 1);

	#status {
		background-color: $background-color;
		border: none;
		cursor: pointer;
	}

	.TaskManagement {
		padding-top: 100px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 85%;
		margin: 0 auto;
	}
	.neuer-auftrag {
		color: white;
		padding: 30px;
		margin-bottom: 30px;
		border-radius: 15px;
		background-color: $accent-color;
		transition: all 0.3s ease 0s;

		&:hover {
			background-color: rgba(0, 136, 169, 0.9);
		}
	}

	table {
		font-size: 24px;
		background-color: $background-color;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		border-collapse: collapse;
		color: white;
	}

	td,
	th {
		padding: 25px 55px;
		text-align: left;
	}

	th {
		cursor: pointer;
		transition: all 0.3s ease 0s;
		&:last-child {
			cursor: default;
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

	tr:nth-child(even) {
		background-color: #e9e9e9;
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
</style>
