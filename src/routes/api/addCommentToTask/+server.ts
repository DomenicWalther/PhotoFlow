import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { auth } from "$lib/server/lucia";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) =>{
	try {
		const { user_id, task_id, comment } = await request.json();
        console.log(comment)
		await prisma.task_comments.create({
			data: {
				task_id: task_id,
                comment: comment,
                createdAt: new Date()
			}
		});
		return json('Successful!');
	} catch {
		return json("Invalid!")
	}

}
