import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { auth } from '$lib/server/lucia';
export const POST: RequestHandler = async ({ request }) => {
	try {
		const session = auth.validateRequest(request);
		const { task_id, comment } = await request.json();
		await prisma.task_comments.create({
			data: {
				task_id: task_id,
				comment: comment,
				createdAt: new Date()
			}
		});
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
