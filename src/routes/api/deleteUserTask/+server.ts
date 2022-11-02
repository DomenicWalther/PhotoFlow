import { PrismaClient } from "@prisma/client"
import { json } from "@sveltejs/kit"
import { auth } from "$lib/server/lucia"
import { LuciaError } from "lucia-auth"
import type { RequestHandler } from "./$types";
import prisma from "$lib/server/prisma"

export const DELETE: RequestHandler = async ({ request }) => {

    const session = await auth.validateRequest(request);
    const { task_id } = await request.json();


    try {
        const session = await auth.validateRequest(request)
        const tasks = await prisma.tasks.delete({
            where: {
                id: task_id,
            }
        })

        return json(tasks)
    } catch (e){
        if (e instanceof LuciaError) {
            return json(e.message)
        } else {
            return json("Something happened...")
        }
    }
}