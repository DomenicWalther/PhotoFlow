import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const date30DaysBack = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
	const session = await locals.getSession();
	console.log(session?.userId);
	const clientCount = await prisma.tasks.count({
		where: {
			user_id: session?.userId,
			is_finished: false
		}
	});

	const pastClientCount = await prisma.tasks.count({
		where: {
			user_id: session?.userId,
			createdAt: {
				gte: date30DaysBack
			}
		}
	});

	const totalFinishedTasks = await prisma.tasks.count({
		where: {
			user_id: session?.userId,
			is_finished: true
		}
	});

	return {
		clientCount,
		pastClientCount,
		totalFinishedTasks
	};
};
