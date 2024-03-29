<script lang="ts">
	import AdditionalOptions from '$lib/components/AdditionalOptions.svelte';
	import { createEventDispatcher, tick } from 'svelte';
	import { FallingConfetti } from 'svelte-canvas-confetti';
	import type { Task } from 'svelte/internal';

	const dispatch = createEventDispatcher();
	let fallingConfetti = false;

	const makeFallingConfetti = async () => {
		fallingConfetti = false;
		await tick();
		fallingConfetti = true;
	};

	export let task: Task;
	export let isUrgent: boolean;
	let isAdditionalOptionsVisible = false;

	function deleteTask() {
		isAdditionalOptionsVisible = false;
		dispatch('deleteTask', {
			id: task.id
		});
	}

	function finishTask() {
		isAdditionalOptionsVisible = false;
		dispatch('finishTask', {
			id: task.id
		});
		makeFallingConfetti();
	}

	function updateTask() {
		isAdditionalOptionsVisible = false;
		dispatch('updateTask', {
			values: [task.id, task.name, task.dueAt, task.additional_information, task.status]
		});
	}

	function openUpdateTask() {
		isAdditionalOptionsVisible = false;
		dispatch('openUpdateTask', {
			task: task
		});
	}

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
</script>

{#if fallingConfetti}
	<FallingConfetti particleCount={300} />
{/if}
<tr class={isUrgent ? 'is-urgent' : ''}>
	<td
		><a href="/tasks/{task.id}">{task.name}</a>{#if task.amount_of_comments > 0}
			<p class="whitespace-nowrap text-sm">
				Auftrag hat {task.amount_of_comments}
				{#if task.amount_of_comments > 1}Kommentare{:else}Kommentar{/if}
			</p>{/if}</td
	>
	<td class="whitespace-nowrap">{task.dueAt.toLocaleDateString('de-DE', dateOptions)}</td>
	<td>
		<div class="flex">
			<h1
				class="pr-2 {task.status === 'NichtBearbeitet'
					? 'text-gray-700'
					: task.status === 'Entwickelt'
					? 'text-red-700'
					: task.status === 'Retuschiert'
					? 'text-yellow-500'
					: task.status === 'Gedruckt'
					? 'text-green-600'
					: ''}"
			>
				&#x2022
			</h1>
			<select name="status" id="status" bind:value={task.status} on:change={() => updateTask()}>
				<option value="NichtBearbeitet">RAW</option>
				<option value="Entwickelt" selected="selected">Entwickelt</option>
				<option value="Retuschiert">Retuschiert</option>
				<option value="Gedruckt">Gedruckt</option>
			</select>
		</div>
	</td>
	<td class="break-words"
		>{task.additional_information === null ? '' : task.additional_information}</td
	>
	<td class="optionen">
		<div class="center moreButton relative text-sm lg:block lg:text-lg">
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

	td {
		padding: 10px;
		text-align: left;
		&:first-child {
			padding-left: 30px;
		}
	}
	#status {
		background-color: $background-color;
		border-radius: 0.25rem;
		cursor: pointer;
	}
	tr:nth-child(even) {
		background-color: #e5e4e4;
		#status {
			background-color: #e5e4e4;
		}
	}
	.is-urgent {
		color: #d21f3c;
	}
</style>
