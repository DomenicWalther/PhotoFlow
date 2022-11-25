import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { comment_id } = await request.json();
		console.log(comment_id);

		const { error } = await supabase.from('task_comments').delete().eq('id', comment_id);
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
