<script>
	import { Avatar } from 'stwui';
	import { signedIn } from './store.js';

	let src = './logo.svg';

	const signIn = () => {
		$signedIn = true;
	}

	const signOut = () => {
		$signedIn = false;
	}
</script>

<header>
	<a href="/"> <img {src} alt="logo" class="logo" /></a>
	<nav>
		<ul class="nav__links">
			<li><a href="/taskOverview">Tasks</a></li>
			<li><a href="#">Projects</a></li>
			<li><a href="#">About</a></li>
		</ul>
	</nav>
	{#if $signedIn}
	<Avatar initials="DW" on:click={signOut}>
		<Avatar.Indicator slot="indicator" placement="bottom-right" />
	</Avatar>
	{:else}
		 <button on:click={signIn}>Sign In</button>
	{/if}
	
	
</header>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
	li,
	a {
		font-family: 'Montserrat', sans-serif;
		font-weight: 500;
		font-size: 16px;
		color: #202e39;
		text-decoration: none;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30px 10%;
		background-color: #edf0f1;

		img {
			height: 5vh;
		}
	}

	.logo {
		cursor: pointer;
	}

	.nav__links {
		list-style: none;
		li {
			display: inline-block;
			padding: 0px 20px;
			a {
				transition: all 0.3s ease 0s;
			}
			a:hover {
				color: #0088a9;
			}
		}
	}
</style>
