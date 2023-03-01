import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const taskID = event.params.slug;

	try {
		const taskFromTaskID = await prisma.tasks.findUnique({
			where: {
				id: Number(taskID)
			}
		});
		const taskCommentsFromTaskID = await prisma.task_comments.findMany({
			orderBy: [
				{
					created_at: 'desc'
				}
			],
			where: {
				task_id: Number(taskID)
			},
			select: {
				comment: true,
				created_at: true,
				id: true
			}
		});

		return {
			tasks: taskFromTaskID,
			comments: taskCommentsFromTaskID
		};
	} catch {
		return 'Error';
	}
};
