import { invalid, redirect, type Actions} from "@sveltejs/kit"
import { auth } from "$lib/server/lucia"

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await request.formData();
        const username = form.get("username")
        const password = form.get("password")

        if (!username || !password || typeof username !== "string" || typeof password !== "string") {
            return invalid(400);
        }

        try {
            const user = await auth.createUser("username", username, {
                password,
                attributes: {
                    username
                }
            });
            const session = await auth.createSession(user.userId);
            locals.setSession(session)
        } catch {
            return invalid(400)
        }
    }
}