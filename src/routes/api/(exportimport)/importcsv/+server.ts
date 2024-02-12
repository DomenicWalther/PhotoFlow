import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const file = await request.json();
		file.file.shift();

		const query = file.file.map((item: any) => {
			return {
				dueAt: new Date(item[2]),
				task: item[1],
				additional_information: item[4],
				taskColumn: item[6],
				is_finished: item[5] === 'true' ? true : false,
				status: item[3]
			};
		});

		for (let i = 0; i < query.length; i++) {
			await prisma.tasks.create({
				data: query[i]
			});
		}
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
