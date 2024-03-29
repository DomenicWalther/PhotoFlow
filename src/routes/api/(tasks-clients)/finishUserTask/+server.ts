import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { id } = await request.json();
		await prisma.tasks.update({
			where: {
				id: id
			},
			data: {
				id: id,
				is_finished: true
			}
		});
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
