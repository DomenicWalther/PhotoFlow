import type { PageServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import { getDay30DaysBack } from '$lib/utils/dateHelpers';
export const load: PageServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/login');
	}
	const user_id = session.user.id;

	const clientCount = await supabaseClient
		.from('tasks')
		.select()
		.match({ user_id: user_id, is_finished: false })
		.then((result) => {
			return result.data.length;
		});

	const pastClientCount = await supabaseClient
		.from('tasks')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user_id)
		.gte('created_at', getDay30DaysBack())
		.then((result) => result.count);

	const totalFinishedTasks = await supabaseClient
		.from('tasks')
		.select('*', { count: 'exact', head: true })
		.match({ user_id: user_id, is_finished: true })
		.then((result) => result.count);

	return {
		clientCount,
		pastClientCount,
		totalFinishedTasks
	};
};
