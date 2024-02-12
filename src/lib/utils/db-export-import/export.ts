import { getDatabaseData } from './dbHelper';

export function getData() {
	const comments = getDatabaseData('task_comments');
	const tasks = getDatabaseData('tasks');
}

function convertData(data: Array<any>) {
	return;
}

function exportData(data: Array<any>) {
	return;
}
