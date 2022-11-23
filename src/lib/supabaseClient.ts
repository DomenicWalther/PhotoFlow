import { createClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

export const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.PUBLIC_SUPABASE_ANON_KEY
);
