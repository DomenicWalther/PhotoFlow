import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { task_id, comment } = await request.json();
	await prisma.task_comments.create({
		data: {
			task_id: task_id,
			comment: comment,
			createdAt: new Date('2022-09-30')
		}
	});
	return json('Successful!');
};
