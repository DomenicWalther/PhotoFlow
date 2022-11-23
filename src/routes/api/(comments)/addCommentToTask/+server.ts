import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { task_id, comment } = await request.json();

		const { error } = await supabase.from('task_comments').insert({
			task_id,
			comment,
			created_at: new Date()
		});
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
