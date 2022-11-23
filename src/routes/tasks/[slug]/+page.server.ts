import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async (event) => {
	const taskID = event.params.slug;
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/login');
	}
	const taskFromTaskID = await supabase.from('tasks').select().eq('id', taskID);

	const taskCommentsFromTaskID = await supabase
		.from('task_comments')
		.select()
		.eq('task_id', taskID)
		.order('created_at', { ascending: false });
	return {
		tasks: taskFromTaskID.data[0],
		comments: taskCommentsFromTaskID.data
	};
};
