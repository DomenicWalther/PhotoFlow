<script lang="ts">
	import { CalendarView } from 'fluent-svelte';
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';
	import moment from 'moment';
	import { io } from '$lib/realtime';

	let value = new Date();
	let task: String, extras: String, status: String;
	let user_id: String;
	extras = '';
	const dispatch = createEventDispatcher();
	function toggleModal() {
		dispatch('toggle');
	}

	function getCurrentTasks() {
		dispatch('fetchTasks');
	}

	function createToast() {
		dispatch('createToast');
	}

	const submitForm = async (event) => {
		fetch('/api/createNewTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id: user_id,
				dueAt: moment(value).format('YYYY-MM-DD'),
				task: task,
				additional_information: extras,
				status: status
			})
		}).then((response) => {
			getCurrentTasks();
			createToast();
			response.json();
			io.emit('database-change');
		});
		toggleModal();
		event.target.reset();
		task = '';
		extras = '';
		value = new Date();
	};
</script>

<Modal handleClose={toggleModal}>
	<Modal.Content slot="content">
		<Card>
			<Card.Header slot="header">Neuer Auftrag</Card.Header>
			<Card.Content slot="content">
				<div class="Calendar">
					<CalendarView bind:value weekStart={1} />
				</div>
				<form on:submit|preventDefault={submitForm}>
					Familie
					<input type="text" bind:value={task} class="inputField" autofocus />
					Extra
					<input type="text" bind:value={extras} class="inputField" />
					<select name="status" id="status" bind:value={status}>
						<option value="NichtBearbeitet">Nicht Bearbeitet</option>
						<option value="Entwickelt">Entwickelt</option>
						<option value="Retuschiert">Retuschiert</option>
						<option value="Gedruckt">Gedruckt</option></select
					>
					<button
						class="mt-4 rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600"
						>Bestätigen</button
					>
				</form>
			</Card.Content>
		</Card>
	</Modal.Content>
</Modal>

<style lang="scss">
	* {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.Calendar {
		margin-bottom: 10px;
	}
	form {
		.inputField {
			margin-bottom: 10px;
		}
	}
</style>
