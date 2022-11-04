import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/lucia"
import prisma from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { user_id } = await request.json();

    try {
        const session = auth.validateRequest(request)
        const tasks = await prisma.tasks.findMany({
            where: {
                user_id: user_id,
                is_finished: false
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