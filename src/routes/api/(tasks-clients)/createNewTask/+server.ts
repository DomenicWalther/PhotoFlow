import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const session = await supabase.auth.getSession();
		if (!session) return;
		const { user_id, dueAt, task, additional_information, status } = await request.json();
		const { error } = await supabase
			.from('tasks')
			.insert({ user_id, dueAt: new Date(dueAt), task, additional_information, status });
		return json('Successful!');
	} catch {
		return json('Invalid!');
	}
};
