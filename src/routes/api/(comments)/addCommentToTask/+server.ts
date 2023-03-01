import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { task_id, comment } = await request.json();
		await prisma.task_comments.create({
			data: {
				task_id: task_id,
				comment: comment,
				created_at: new Date()
			}
		});
		await prisma.tasks.update({
			where: {
				id: task_id
			},
			data: {
				amount_of_comments: { increment: 1 }
			}
		});
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
