<script lang="ts">
    import { getUser } from "@lucia-auth/sveltekit/client"

    const user = getUser();
</script>

<p>{$user?.username}</p>
<p>{$user?.userId}</p>



