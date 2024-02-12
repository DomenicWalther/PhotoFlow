import type { Writable } from 'svelte/store';
import { writable, derived } from 'svelte/store';

interface Tasks {
	name: string;
	dueAt: Date;
	additional_information: string;
	status: string;
	id: number;
	is_finished: boolean;
	amount_of_comments: number;
}

// -- Current Task Variables
export const tasks: Writable<Tasks[]> = writable([]);
export const tasksSearchTerm = writable('');
export const showFinishedTasks = writable(false);
export const tasksFiltered = derived(
	[tasksSearchTerm, tasks, showFinishedTasks],
	([$tasksSearchTerm, $tasks, $showFinishedTasks]) => {
		return $tasks.filter(
			(o) =>
				Object.keys(o).some((k) =>
					o[k].toString().toLowerCase().includes($tasksSearchTerm.toLowerCase())
				) && o.is_finished === $showFinishedTasks
		);
	}
);
