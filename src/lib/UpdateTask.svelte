<script>
	import { CalendarView } from 'fluent-svelte';
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';

	export let updateValues;

	const dispatch = createEventDispatcher();

	function toggleModal() {
		dispatch('toggle');
	}

	function updateTasks() {
		dispatch('taskUpdate', {
			values: updateValues
		});
		toggleModal();
	}
</script>

<Modal handleClose={toggleModal}>
	<Modal.Content slot="content">
		<Card>
			<Card.Header slot="header">Auftrag bearbeiten</Card.Header>
			<Card.Content slot="content">
				<div class="Calendar">
					<CalendarView bind:value={updateValues[2]} />
				</div>
				<form on:submit|preventDefault={updateTasks}>
					Familie
					<input type="text" bind:value={updateValues[1]} class="inputField" />
					Extra
					<input type="text" bind:value={updateValues[3]} class="inputField" />
					<select name="status" id="status" bind:value={updateValues[4]}>
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
