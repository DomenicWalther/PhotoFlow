import { writable, derived } from 'svelte/store';



// -- Current Task Variables 
export const tasks = writable([]);
export const tasksSearchTerm = writable('');
export const tasksFiltered = derived([tasksSearchTerm, tasks], ([$tasksSearchTerm, $tasks]) =>
	$tasks.filter((o) =>
		Object.keys(o).some((k) =>
			o[k].toString().toLowerCase().includes($tasksSearchTerm.toLowerCase())
		)
	)
);


// -- User SignIn Variables
export const signedIn = writable(false);
