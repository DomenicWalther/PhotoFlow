<script>
	import '../app.postcss';
	import 'fluent-svelte/theme.css';
	import NavBar from '$lib/NavBar.svelte';

	import { page } from '$app/stores';
	import { handleSession } from '@lucia-auth/sveltekit/client';
	handleSession(page);
</script>

<NavBar />
<slot />
