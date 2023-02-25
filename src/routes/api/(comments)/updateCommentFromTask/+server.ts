import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { new_comment, comment_id } = await request.json();

		await prisma.task_comments.update({
			where: {
				id: comment_id
			},
			data: {
				id: comment_id,
				comment: new_comment
			}
		});
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
