import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	try {
		const kanbanCards = await prisma.tasks.findMany();

		return {
			kanban: kanbanCards,
			columns: [
				{
					id: '1',
					label: 'To-Do'
				},
				{
					id: '2',
					label: 'In Bearbeitung'
				},
				{
					id: '3',
					label: 'Fertig'
				}
			]
		};
	} catch {
		return 'Error!';
	}
};
