<script>
	import '../app.postcss';
	import 'fluent-svelte/theme.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
</script>

<slot />
