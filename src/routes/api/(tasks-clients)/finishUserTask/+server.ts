import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { id } = await request.json();
		const { error } = await supabase
			.from('tasks')
			.update({ id, finished_at: new Date(), is_finished: true })
			.eq('id', id);
		return json('Worked!');
	} catch {
		return json('Invalid!');
	}
};
