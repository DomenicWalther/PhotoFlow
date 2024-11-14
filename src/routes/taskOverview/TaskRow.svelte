<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Task } from '$lib/types/Task';
	import confetti from 'canvas-confetti';

	export let task: Task;
	export let isUrgent = false;

	const dispatch = createEventDispatcher();

	function formatDate(date: Date): string {
		const d = new Date(date);
		return d.toLocaleDateString('de-DE', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}

	function handleDelete() {
		dispatch('deleteTask', { id: task.id });
	}

	function handleFinish() {
		confetti({
			particleCount: 100,
			spread: 160,
			origin: { y: 0, x: 0.5 },
			gravity: 1.2,
			ticks: 300
		});
		dispatch('finishTask', { id: task.id });
	}

	function handleUpdate() {
		dispatch('openUpdateTask', { task });
	}

	function handleStatusChange(event: Event) {
		const newStatus = (event.target as HTMLSelectElement).value;
		
		dispatch('updateTask', { 
			values: [
				task.id, 
				task.name, 
				task.dueAt, 
				task.additional_information, 
				newStatus,
				task.orderPath || ''
			] 
		});
	}

	function formatPath(path: string): string {
		return path.replace(/\\/g, '/');
	}
</script>

<tr class:urgent={isUrgent} class:finished={task.is_finished}>
	<td class="task-name">
		<a href="/task/{task.id}" class="task-link">
			{task.name}
			{#if isUrgent}
				<span class="urgent-badge">Dringend</span>
			{/if}
		</a>
	</td>
	<td>{formatDate(task.dueAt)}</td>
	<td>
		{#if !task.is_finished}
			<select 
				value={task.status}
				on:change={handleStatusChange}
				class="status-badge"
				class:status-finished={task.is_finished}
			>
				<option value="NichtBearbeitet">RAW</option>
				<option value="Entwickelt">Entwickelt</option>
				<option value="Retuschiert">Retuschiert</option>
				<option value="Gedruckt">Gedruckt</option>
			</select>
		{:else}
			<span class="status-badge status-finished">
				{task.status}
			</span>
		{/if}
	</td>
	<td>{task.additional_information}</td>
	<td class="actions">
		<div class="flex items-center gap-2">
			{#if !task.is_finished}
				<button
					on:click={handleFinish}
					class="action-button finish-button"
					title="Auftrag abschließen"
				>
					✓
				</button>
				<button
					on:click={handleUpdate}
					class="action-button edit-button"
					title="Auftrag bearbeiten"
				>
					✎
				</button>
			{/if}
			<button
				on:click={handleDelete}
				class="action-button delete-button"
				title="Auftrag löschen"
			>
				×
			</button>
			{#if task.orderPath}
				<a
					href="photoflow://open/explorer/{formatPath(task.orderPath)}"
					class="action-button folder-button"
					title="Ordner öffnen"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd" />
						<path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
					</svg>
				</a>
			{/if}
		</div>
	</td>
</tr>

<style lang="scss">
	tr {
		@apply transition-all duration-200;

		&.urgent {
			@apply bg-red-50;
			td {
				@apply text-red-900;
			}
		}

		&.finished {
			@apply bg-gray-50;
			td {
				@apply text-gray-500;
			}
		}

		td {
			@apply py-4 px-6 text-sm;
		}
	}

	.task-name {
		@apply font-medium flex items-center gap-2;
	}

	.task-link {
		@apply hover:text-blue-600 transition-colors duration-200 flex items-center gap-2;
		text-decoration: none;
		
		&:hover {
			text-decoration: underline;
		}
	}

	.urgent-badge {
		@apply text-xs px-2 py-1 rounded-full bg-red-200 text-red-800 font-semibold;
	}

	.status-badge {
		@apply px-3 py-1 rounded-full text-xs font-semibold;
		background-color: #e5edff;
		color: #1e40af;
		border: none;
		cursor: pointer;
		appearance: none;
		-webkit-appearance: none;
		padding-right: 2rem; /* Platz für den Pfeil */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231e40af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1rem;

		&:hover {
			@apply bg-blue-100;
		}

		&:focus {
			@apply outline-none ring-2 ring-blue-300;
		}

		&.status-finished {
			@apply bg-green-100 text-green-800;
		}

		option {
			@apply bg-white text-gray-900;
		}
	}

	.actions {
		@apply flex items-center gap-2;
	}

	.action-button {
		@apply h-8 w-8 rounded-full flex items-center justify-center text-white transition-all duration-200;
		font-size: 16px;

		&:hover {
			@apply transform scale-110;
		}

		&.finish-button {
			@apply bg-green-500 hover:bg-green-600;
		}

		&.edit-button {
			@apply bg-blue-500 hover:bg-blue-600;
		}

		&.delete-button {
			@apply bg-red-500 hover:bg-red-600;
		}

		&.folder-button {
			@apply bg-blue-500 hover:bg-blue-600;
		}
	}

	// Responsive styles
	@media (max-width: 768px) {
		td {
			@apply py-3 px-4 text-xs;
		}

		.action-button {
			@apply h-6 w-6;
			font-size: 14px;
		}

		.status-badge, .status-select {
			@apply px-2 py-0.5 text-xs;
		}

		.status-select {
			min-width: 100px;
		}
	}
</style>
