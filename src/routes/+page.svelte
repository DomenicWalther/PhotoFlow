<script lang="ts">
	import { getUser } from '@lucia-auth/sveltekit/client';

	const user = getUser();
</script>

<p>{$user?.email}</p>
<p>{$user?.userId}</p>
