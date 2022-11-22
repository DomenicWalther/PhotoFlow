import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { task_id } = await request.json();
		const { error } = await supabase.from('tasks').delete().eq('id', task_id);

		return json(error);
	} catch (e) {
		return json('Something happened...');
	}
};
