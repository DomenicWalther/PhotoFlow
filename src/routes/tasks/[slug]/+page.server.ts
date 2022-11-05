import type { PageServerLoad } from "./$types"
import prisma from "$lib/server/prisma"

export const load: PageServerLoad = async ({ params}) => {
    const taskID = params.slug

    const taskFromTaskID = await prisma.tasks.findUnique({
        where: {
            id: params.slug
        }
    })

    const taskCommentsFromTaskID = await prisma.task_comments.findMany({
        orderBy: {
            createdAt: 'desc'
        }, where: {
            task_id: params.slug
        }
    })
    return {
        tasks: taskFromTaskID,
        comments: taskCommentsFromTaskID }
}