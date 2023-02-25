import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { user_id } = await request.json();

	try {
		const tasks = await prisma.tasks.findMany({
			where: {
				is_finished: false
			},
			select: {
				dueAt: true,
				task: true,
				additional_information: true,
				status: true,
				id: true
			}
		});

		return json(tasks);
	} catch {
		return json('Invalid! ');
	}
};
