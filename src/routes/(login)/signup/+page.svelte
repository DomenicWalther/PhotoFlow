<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let email: string, password: string;

	const handleSignup = async () => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
	};
</script>

<div>
	<h1>Create an account</h1>
	<form>
		<label for="username">E-Mail</label><br />
		<input type="email" name="email" id="email" bind:value={email} /><br />
		<label for="password">Password</label><br />
		<input type="password" name="password" id="password" bind:value={password} /><br />
		<input type="submit" value="Continue" class="button" on:click|preventDefault={handleSignup} />
	</form>
</div>
