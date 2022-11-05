import type { PageServerLoad } from "./$types"
import prisma from "$lib/server/prisma"

export const load: PageServerLoad = async ({ params}) => {
    const taskID = params.slug

    const taskFromTaskID = await prisma.tasks.findUnique({
        where: {
            id: params.slug
        }
    })
    return {
        tasks: taskFromTaskID }
}