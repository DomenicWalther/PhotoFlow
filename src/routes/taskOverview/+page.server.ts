import { invalid, redirect, type Actions} from "@sveltejs/kit"

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const form = await request.formData();
        
    }
}