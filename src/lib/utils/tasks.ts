import { get } from "svelte/store";
import { tasks } from "$lib/Stores/TaskStore";
import { sort_by } from "$lib/utils/generalHelpers";

async function getAndCreateTasks() {
	const response = await fetch("/api/getUserTasks", {
		method: "POST",
	});
	const data = await response.json();
	console.log("Loaded tasks from DB:", data);
	createTasks(data);
}

function createTasks(data) {
	let tasksValue = get(tasks);
	if (data !== "Not found") {
		tasksValue = data.map((i) => {
			return {
				name: i.task,
				dueAt: new Date(i.dueAt.replace(" ", "T")),
				additional_information: i.additional_information,
				status: i.status,
				id: i.id,
				is_finished: i.is_finished,
				amount_of_comments: i.amount_of_comments,
				taskColumn: i.taskColumn,
				orderPath: i.orderPath,
			};
		});
	} else {
		tasksValue = [];
	}
	tasks.set(tasksValue.sort(sort_by("dueAt", false)));
}

async function getCurrentTasks() {
	const response = await fetch("/api/getUserTasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({}),
	});
	const result = await response.json();
	return result;
}

export { getCurrentTasks, createTasks, getAndCreateTasks };
