import prisma from '$lib/server/prisma';

export const getDatabaseData = async (database) => {
	try {
		let data;

		switch (database) {
			case 'tasks':
				data = await prisma.tasks.findMany();
				break;
			case 'comments':
				data = await prisma.task_comments.findMany();
				break;
			default:
				console.log('Invalid database');
		}
		return data;
	} catch {
		return 'Invalid! ';
	}
};
