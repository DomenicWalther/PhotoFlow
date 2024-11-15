import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

import prisma from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { tasks } = await request.json();

		// Lösche zuerst alle existierenden Tasks

		await prisma.tasks.deleteMany({});

		// Erstelle die neuen Test-Tasks einzeln

		for (const task of tasks) {
			await prisma.tasks.create({
				data: {
					task: task.name,

					dueAt: new Date(task.dueAt),

					created_at: new Date(task.created_at),

					status: task.status,

					additional_information: task.additional_information,

					is_finished: task.is_finished,

					taskColumn: task.taskColumn,

					orderPath: task.orderPath || "",
				},
			});
		}

		return json({ success: true });
	} catch (error) {
		console.error("Error importing test data:", error);

		return json({ error: "Failed to import test data" }, { status: 500 });
	}
};
