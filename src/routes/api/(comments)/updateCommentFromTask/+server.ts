import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';
import { comment } from 'postcss';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { new_comment, comment_id } = await request.json();
		console.log(new_comment, comment_id);
		const { error } = await supabase
			.from('task_comments')
			.update({ id: comment_id, comment: new_comment, created_at: new Date() })
			.eq('id', comment_id);

		console.log(error);
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
