import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	try {
		const {
			taskID,
			dueAt,
			task,
			additional_information,
			taskColumn,
			status,
			orderPath,
		} = await request.json();

		if (taskID) {
			await prisma.tasks.update({
				where: {
					id: taskID,
				},
				data: {
					dueAt: new Date(dueAt),
					task,
					additional_information,
					taskColumn,
					status,
					orderPath,
				},
			});
			return json("Successful!");
		}

		await prisma.tasks.create({
			data: {
				dueAt: new Date(dueAt),
				task,
				additional_information,
				status,
				orderPath,
			},
		});
		return json("Successful!");
	} catch (error) {
		return json("Invalid!");
	}
};
