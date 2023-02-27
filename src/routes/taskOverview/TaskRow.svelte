<script lang="ts">
	import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let task;
	let isAdditionalOptionsVisible = false;

	function deleteTask() {
		dispatch('deleteTask', {
			id: task.id
		});
		isAdditionalOptionsVisible = false;
	}

	function finishTask() {
		dispatch('finishTask', {
			id: task.id
		});
		isAdditionalOptionsVisible = false;
	}

	function updateTask() {
		dispatch('updateTask', {
			values: [task.id, task.name, task.dueAt, task.additional_information, task.status]
		});
		isAdditionalOptionsVisible = false;
	}

	function openUpdateTask() {
		dispatch('openUpdateTask', {
			task: task
		});
	}

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
</script>

<tr>
	<td><a href="/tasks/{task.id}">{task.name}</a></td>
	<td class="whitespace-nowrap">{task.dueAt.toLocaleDateString('de-DE', dateOptions)}</td>
	<td>
		<select name="status" id="status" bind:value={task.status} on:change={() => updateTask()}>
			<option value="NichtBearbeitet">Nicht Bearbeitet</option>
			<option value="Entwickelt" selected="selected">Entwickelt</option>
			<option value="Retuschiert">Retuschiert</option>
			<option value="Gedruckt">Gedruckt</option>
		</select>
	</td>
	<td>{task.additional_information === null ? '' : task.additional_information}</td>
	<td class="optionen">
		<div class="center moreButton relative hidden text-sm lg:block lg:text-lg">
			<button
				on:click={() => {
					isAdditionalOptionsVisible = !isAdditionalOptionsVisible;
				}}>...</button
			>
			{#if isAdditionalOptionsVisible}
				<AdditionalOptions
					options={[
						{ label: 'Bearbeiten', onClick: openUpdateTask, disabled: false },
						{ label: 'Löschen', onClick: deleteTask, disabled: false },
						{ label: 'Abschließen', onClick: finishTask, disabled: false }
					]}
					on:clicked_outside={() => {
						isAdditionalOptionsVisible = false;
					}}
				/>
			{/if}
		</div>
	</td>
</tr>

<style lang="scss">
	$background-color: #edf0f1;
	$accent-color: rgb(37 99 235);
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
</style>
