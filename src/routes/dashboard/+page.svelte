<script lang="ts">
	import Card from './Card.svelte';
	import { dropzone, draggable } from '$lib/utils/dnd';
	import NewKanbanCard from '$lib/components/NewKanbanCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let isNewKanbanCardModalOpen = false;
	let NewKanbanCardColumn = '';

	const toggleNewKanbanCardModal = (column_id) => {
		isNewKanbanCardModalOpen = !isNewKanbanCardModalOpen;
		NewKanbanCardColumn = column_id;
	};

	const updateKanbanDatabase = (card) => {
		console.log(card);
		fetch('/api/updateCard', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ card })
		}).then((response) => {
			response.json;
		});
	};
</script>

<button class="rounded-lg bg-blue-600 py-5 px-10 font-bold text-white"
	><a href="/taskOverview">Aufgabenübersicht</a></button
>
<div class="board m-5 flex w-full ">
	{#each data.columns as column}
		{@const cards = data.kanban.filter((c) => c.taskColumn === column.id)}
		<div
			class="column mr-10 max-w-lg"
			use:dropzone={{
				on_dropzone(card_id) {
					card_id = parseInt(card_id);
					const card = data.kanban.find((c) => c.id === card_id);
					card.taskColumn = column.id;
					data = data;
					updateKanbanDatabase(card);
				}
			}}
		>
			<h3 class="text-base">{column.label}</h3>
			{#if cards.length > 0}
				{#each cards as card}
					<div use:draggable={card.id}>
						<Card
							taskHeading={card.taskName}
							taskDescription={card.taskDescription}
							taskTimeLeft={card.timeleft}
						/>
					</div>
				{/each}
			{/if}
			<button
				class="new-card mt-5 w-full  rounded-md border-2 border-dashed border-gray-300 py-3 text-center font-bold text-gray-500"
				on:click={() => toggleNewKanbanCardModal(column.id)}
			>
				+ Neue Aufgabe hinzufügen
			</button>
		</div>
	{/each}
</div>

{#if isNewKanbanCardModalOpen}
	<NewKanbanCard on:toggleModal={toggleNewKanbanCardModal} column_id={NewKanbanCardColumn} />
{/if}

<style>
	.board > * {
		min-width: 28rem;
	}
	.column:global(.droppable) {
		border-radius: 0.5rem;
		outline-style: dashed;
		outline-offset: 2px;
		outline-color: #3b82f6;
		outline-width: 2px;
	}
	.column:global(.droppable) * {
		pointer-events: none;
	}
</style>
