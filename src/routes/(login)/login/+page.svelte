<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let email: string, password: string;

	const handleLogin = async () => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			console.log(error);
			return;
		}
		goto('/taskOverview');
	};
</script>

<div class="">
	<h1>Log into Account</h1>
	<form>
		<label for="email">E-mail</label><br />
		<input type="text" name="email" id="email" bind:value={email} /><br />
		<label for="password">Password</label><br />
		<input type="password" name="password" id="password" bind:value={password} /><br />
		<input type="submit" value="Continue" class="button" on:click|preventDefault={handleLogin} />
	</form>
	<a href="/forgotPassword"><button>Forgot Password</button></a>
	<a href="/signup"><button>Sign up</button></a>
</div>
