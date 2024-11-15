import { writable, derived } from "svelte/store";
import type { Task } from "$lib/types/Task";

export const tasks = writable<Task[]>([]);
export const tasksSearchTerm = writable("");
export const showFinishedTasks = writable(false);

interface TaskFilters {
	dateFrom: Date | null;
	dateTo: Date | null;
	status: string;
	isAndFilter: boolean;
}

export const tasksFilters = writable<{
	dateFrom: Date | null;
	dateTo: Date | null;
	status: string;
	isAndFilter: boolean;
}>({
	dateFrom: null,
	dateTo: null,
	status: "",
	isAndFilter: true,
});

export const tasksFiltered = derived(
	[tasks, tasksSearchTerm, tasksFilters, showFinishedTasks],
	([$tasks, $searchTerm, $filters, $showFinishedTasks]) => {
		return $tasks.filter((task) => {
			if ($showFinishedTasks && !task.is_finished) return false;
			if (!$showFinishedTasks && task.is_finished) return false;

			const searchMatch = $searchTerm
				? task.name.toLowerCase().includes($searchTerm.toLowerCase()) ||
					task.additional_information
						.toLowerCase()
						.includes($searchTerm.toLowerCase())
				: true;

			const statusMatch = $filters.status
				? task.status === $filters.status
				: true;

			const dateMatch = (() => {
				if (!$filters.dateFrom && !$filters.dateTo) return true;

				const taskDate = new Date(task.dueAt);
				taskDate.setHours(12, 0, 0, 0);

				if ($filters.dateFrom) {
					const fromDate = new Date($filters.dateFrom);
					fromDate.setHours(0, 0, 0, 0);
					if (taskDate < fromDate) return false;
				}

				if ($filters.dateTo) {
					const toDate = new Date($filters.dateTo);
					toDate.setHours(23, 59, 59, 999);
					if (taskDate > toDate) return false;
				}

				return true;
			})();

			if ($filters.isAndFilter) {
				return searchMatch && statusMatch && dateMatch;
			} else {
				return (
					searchMatch ||
					statusMatch ||
					($filters.dateFrom || $filters.dateTo ? dateMatch : false)
				);
			}
		});
	},
);
