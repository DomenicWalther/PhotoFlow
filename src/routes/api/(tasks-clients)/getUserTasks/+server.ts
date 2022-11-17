import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
	const { user_id } = await request.json();
	console.log(user_id);

	const { data, error } = await supabase.from('tasks').select().eq('user_id', user_id);
	console.log(data);
	console.log(error);
	return json(data);
};
