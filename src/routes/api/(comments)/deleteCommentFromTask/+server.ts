import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { comment_id } = await request.json();

		const tasks = await prisma.task_comments.delete({
			where: {
				id: comment_id
			}
		});
		return json(tasks);
	} catch {
		return json('Invalid!');
	}
};
