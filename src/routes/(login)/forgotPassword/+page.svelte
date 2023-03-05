<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let email: string;
	const handlePasswordReset = async () => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email);
	};
</script>

<div>
	<form>
		<p>Enter your E-Mail to send a Code to reset your password.</p>
		<label for="email">E-Mail</label>
		<input type="email" name="email" id="email" bind:value={email} />
		<input
			type="submit"
			value="Continue"
			class="button"
			on:click|preventDefault={handlePasswordReset}
		/>
	</form>
</div>
