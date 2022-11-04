import type { PageServerLoad } from './$types';
import prisma from "$lib/server/prisma"

export const load: PageServerLoad = async ({ cookies, locals }) => {
    const session= await locals.getSession();
    console.log(session?.userId)
    const taskCount = await prisma.tasks.count({
        where: {
            user_id: session?.userId
        }
    })

    console.log(taskCount)

    return {
        taskCount: taskCount
    }
}


