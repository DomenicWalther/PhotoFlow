<script lang="ts">
	import { CalendarView } from 'fluent-svelte';
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';

	import { supabase } from '$lib/supabaseClient';

	let value = new Date();
	let task: String, extras: String, status: String;
	let user_id: String;
	extras = '';
	onMount(async () => {
		user_id = await supabase.auth.getUser().then((result) => {
			return result.data.user.id;
		});
	});
	const dispatch = createEventDispatcher();
	function toggleModal() {
		dispatch('toggle');
	}

	function getCurrentTasks() {
		dispatch('fetchTasks');
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
			response.json();
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
					<CalendarView bind:value />
				</div>
				<form on:submit|preventDefault={submitForm}>
					Familie
					<input type="text" bind:value={task} class="inputField" />
					Extra
					<input type="text" bind:value={extras} class="inputField" />
					<select name="status" id="status" bind:value={status}>
						<option value="NichtBearbeitet">Nicht Bearbeitet</option>
						<option value="Entwickelt">Entwickelt</option>
						<option value="Retuschiert">Retuschiert</option>
						<option value="Gedruckt">Gedruckt</option></select
					>
					<button>Bestätigen</button>
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

	button {
		margin-top: 10px;
		padding: 9px 25px;
		background-color: rgba(0, 136, 169, 1);
		color: #edf0f1;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s ease 0s;

		&:hover {
			background-color: rgba(0, 136, 169, 0.8);
		}
	}
</style>
