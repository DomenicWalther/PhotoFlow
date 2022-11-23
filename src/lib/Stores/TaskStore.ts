import { writable, derived } from 'svelte/store';

// -- Current Task Variables
export const tasks: Tasks | [Tasks] = writable([]);
export const tasksSearchTerm = writable('');
export const tasksFiltered = derived([tasksSearchTerm, tasks], ([$tasksSearchTerm, $tasks]) =>
	$tasks.filter((o) =>
		Object.keys(o).some((k) =>
			o[k].toString().toLowerCase().includes($tasksSearchTerm.toLowerCase())
		)
	)
);
