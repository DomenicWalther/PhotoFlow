import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { card } = await request.json();
		const { id, created_at, dueAt, task, additional_information, taskColumn } = card;

		await prisma.tasks.update({
			where: {
				id: id
			},
			data: {
				id,
				created_at,
				dueAt,
				task,
				additional_information,
				taskColumn
			}
		});
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
