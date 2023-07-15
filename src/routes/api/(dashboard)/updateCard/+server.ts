import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { card } = await request.json();
		const { id, created_at, completion_Date, taskName, taskDescription, taskColumn } = card;

		await prisma.kanbanCard.update({
			where: {
				id: id
			},
			data: {
				id,
				created_at,
				completion_Date,
				taskName,
				taskDescription,
				taskColumn
			}
		});
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
