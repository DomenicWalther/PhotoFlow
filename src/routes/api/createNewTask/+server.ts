import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { auth } from "$lib/server/lucia";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) =>{
	const { user_id, dueAt, task, additional_information, status } = await request.json();
	try {
		const session = await auth.validateRequest(request)
		await prisma.tasks.create({
			data: {
				user_id,
				dueAt: new Date(dueAt),
				task,
				additional_information,
				status
			}
		});
		return json('Successful!');
	} catch {
		return json("Invalid!")
	}

}
