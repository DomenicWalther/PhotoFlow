import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { comment_id, task_id } = await request.json();

		const tasks = await prisma.task_comments.delete({
			where: {
				id: comment_id
			}
		});
		await prisma.tasks.update({
			where: {
				id: task_id
			},
			data: {
				amount_of_comments: { decrement: 1 }
			}
		});
		return json(tasks);
	} catch {
		return json('Invalid!');
	}
};
