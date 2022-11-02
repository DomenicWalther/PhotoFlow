import { PrismaClient } from "@prisma/client"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/lucia"
import prisma from "$lib/server/prisma"

function exclude<Tasks, Key extends keyof Tasks>(
    task: Tasks,
    ...keys: Key[]
): Omit<Tasks, Key> {
    for (let key of keys) {
        delete task[key]
    }
    return task
}

export const POST: RequestHandler = async ({ request }) => {
    const { user_id } = await request.json();

    try {
        const session = auth.validateRequest(request)
        const tasks = await prisma.tasks.findMany({
            where: {
                user_id: user_id
            },
            select: {
                dueAt: true,
                task: true,
                additional_information: true,
                status: true,
                id: true
            }
        })

        return json(tasks)
    
    } catch {
        return json("Invalid! ")
    }


}