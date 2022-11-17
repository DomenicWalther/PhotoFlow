<script>
	import '../app.postcss';
	import 'fluent-svelte/theme.css';
	import NavBar from '$lib/NavBar.svelte';

	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<NavBar />
<slot />
