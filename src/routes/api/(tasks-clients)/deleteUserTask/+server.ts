import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { task_id } = await request.json();
		const tasks = await prisma.tasks.delete({
			where: {
				id: task_id
			}
		});

		return json(tasks);
	} catch (e) {
		return json('Something happened...');
	}
};
