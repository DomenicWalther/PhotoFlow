import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { taskID, dueAt, task, additional_information, taskColumn, status } =
			await request.json();
		if (taskID) {
			await prisma.tasks.update({
				where: {
					id: taskID
				},
				data: {
					dueAt: new Date(dueAt),
					task,
					additional_information,
					taskColumn,
					status
				}
			});
			return json('Successful!');
		} else {
			await prisma.tasks.create({
				data: {
					dueAt: new Date(dueAt),
					task,
					additional_information,
					status
				}
			});
		}
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
