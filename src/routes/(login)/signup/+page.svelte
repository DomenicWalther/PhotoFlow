<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div>
	<h1>Create an account</h1>
	<form use:enhance method="post">
		<label for="username">E-Mail</label><br>
		<input type="email" name="email" id="email"><br>
		<label for="password">Password</label><br>
		<input type="password" name="password" id="password"><br>
		<input type="submit" value="Continue" class="button">
	</form>
</div>