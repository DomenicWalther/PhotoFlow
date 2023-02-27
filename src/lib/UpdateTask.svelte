<script>
	import { CalendarView } from 'fluent-svelte';
	import { Card, Modal } from 'stwui';
	import { createEventDispatcher } from 'svelte';

	export let updateValues;

	const dispatch = createEventDispatcher();

	function toggleModal() {
		dispatch('toggle');
	}

	function createToast() {
		dispatch('createToast');
	}

	function updateTasks() {
		dispatch('taskUpdate', {
			values: updateValues
		});
		toggleModal();
		createToast();
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
