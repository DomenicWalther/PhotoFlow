import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { user_id, dueAt, task, additional_information, status } = await request.json();
		await prisma.tasks.create({
			data: {
				dueAt: new Date(dueAt),
				task,
				additional_information,
				status
			}
		});
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
