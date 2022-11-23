import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
	const { user_id } = await request.json();
	const { data, error } = await supabase
		.from('tasks')
		.select()
		.match({ user_id: user_id, is_finished: false });
	return json(data);
};
