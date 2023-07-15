import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	try {
		const kanbanCards = await prisma.kanbanCard.findMany();

		return {
			kanban: kanbanCards,
			columns: [
				{
					id: '1',
					label: 'To Do'
				},
				{
					id: '2',
					label: 'In Progress'
				},
				{
					id: '3',
					label: 'Done'
				}
			]
		};
	} catch {
		return 'Error!';
	}
};
