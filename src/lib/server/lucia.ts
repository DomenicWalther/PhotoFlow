import lucia from "lucia-auth"
import prisma from "@lucia-auth/adapter-prisma"
import { dev } from "$app/environment";
import { PrismaClient} from "@prisma/client"

const client = new PrismaClient();
export const auth = lucia({
    adapter: prisma(client),
    env: dev ? "DEV" : "PROD",
    transformUserData: (userData) => {
        return {
            userId: userData.id,
            email: userData.email
        }
    }
})

export type Auth = typeof auth;