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

export const tasksFilters = writable<TaskFilters>({
	dateFrom: null,
	dateTo: null,
	status: "",
	isAndFilter: true,
});

export const tasksFiltered = derived(
	[tasks, tasksSearchTerm, showFinishedTasks, tasksFilters],
	([$tasks, $searchTerm, $showFinished, $filters]) => {
		return $tasks.filter((task) => {
			const taskDate = new Date(task.dueAt);
			taskDate.setHours(0, 0, 0, 0);

			let matchesDateFrom = true;
			let matchesDateTo = true;

			if ($filters.dateFrom) {
				const fromDate = new Date($filters.dateFrom);
				fromDate.setHours(0, 0, 0, 0);
				matchesDateFrom = taskDate.getTime() >= fromDate.getTime();
			}

			if ($filters.dateTo) {
				const toDate = new Date($filters.dateTo);
				toDate.setHours(0, 0, 0, 0);
				matchesDateTo = taskDate.getTime() <= toDate.getTime();
			}

			const matchesSearch =
				task.name.toLowerCase().includes($searchTerm.toLowerCase()) ||
				task.additional_information
					.toLowerCase()
					.includes($searchTerm.toLowerCase());
			const matchesFinished = $showFinished ? true : !task.is_finished;
			const matchesStatus = $filters.status
				? task.status === $filters.status
				: true;

			if ($filters.isAndFilter) {
				// AND Logik
				return (
					matchesSearch &&
					matchesFinished &&
					matchesDateFrom &&
					matchesDateTo &&
					matchesStatus
				);
			} else {
				// OR Logik
				const hasDateFilter = $filters.dateFrom || $filters.dateTo;
				const dateMatches = hasDateFilter
					? matchesDateFrom && matchesDateTo
					: false;
				const statusMatches = $filters.status ? matchesStatus : false;

				return (
					matchesSearch && matchesFinished && (dateMatches || statusMatches)
				);
			}
		});
	},
);
