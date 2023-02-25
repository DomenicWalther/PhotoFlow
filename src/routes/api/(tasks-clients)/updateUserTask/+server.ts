import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { id, status, task, dueAt, additional_information } = await request.json();
		await prisma.tasks.update({
			where: {
				id: id
			},
			data: {
				id: id,
				status: status,
				task: task,
				dueAt: new Date(dueAt),
				additional_information: additional_information
			}
		});
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
