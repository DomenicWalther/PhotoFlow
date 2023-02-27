import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const tasks = await prisma.tasks.findMany();

		return json(tasks);
	} catch {
		return json('Invalid! ');
	}
};
