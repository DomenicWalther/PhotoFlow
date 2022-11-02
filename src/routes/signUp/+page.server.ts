import { invalid, redirect, type Actions} from "@sveltejs/kit"
import { auth } from "$lib/server/lucia"
import { random, customRandom} from "nanoid"

function generateCode() {
    const characters = "1234567890";
    return customRandom(characters, 8, random())();
}
export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await request.formData();
        const email = form.get("email")
        const password = form.get("password")

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return invalid(400);
        }

        try {
            const user = await auth.createUser("email", email, {
                password,
                attributes: {
                    email,
                    email_verified: false
                }
            });
            const session = await auth.createSession(user.userId);
            const code = generateCode()

            await setUserVerificationCode(userId, {
                code,
                expires: new Date().getTime() + 1000 * 60 * 24 * 8
            });
            locals.setSession(session)
        } catch {
            return invalid(400)
        }
    }
}