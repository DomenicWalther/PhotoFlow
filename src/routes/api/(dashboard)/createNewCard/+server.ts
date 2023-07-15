import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { completion_Date, taskName, taskDescription, taskColumn } = await request.json();
		console.log(completion_Date, taskName, taskDescription, taskColumn);
		await prisma.kanbanCard.create({
			data: {
				completion_Date: new Date(completion_Date),
				taskName,
				taskDescription,
				taskColumn: taskColumn.toString()
			}
		});
		console.log('Success');

		return json('Successful!');
	} catch {
		console.log('Fail!');
		return json('Invalid!');
	}
};
