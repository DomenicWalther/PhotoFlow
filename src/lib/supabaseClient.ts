import { createClient } from '@supabase/auth-helpers-sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$lib/Env';

let supabase_url, anon_key;

if (process.env.NODE_ENV === 'production') {
	supabase_url = process.env.PUBLIC_SUPABASE_URL;
	anon_key = process.env.PUBLIC_SUPABASE_ANON_KEY;
} else {
	supabase_url = PUBLIC_SUPABASE_URL;
	anon_key = PUBLIC_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabase_url, anon_key);
