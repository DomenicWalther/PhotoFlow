<script>
	import { Avatar, Dropdown, Button } from 'stwui';
	import { supabase } from './supabaseClient';
	let visible = false;

	let logoSource = '/logo.svg';

	function closeDropdown() {
		visible = false;
	}

	function toggleDropdown() {
		visible = !visible;
	}
</script>

<header>
	<a href="/"> <img src={logoSource} alt="logo" class="logo" /></a>
	<nav>
		<ul class="nav__links">
			<li><a href="/taskOverview">Tasks</a></li>
			<li><a href="#">Projects</a></li>
			<li><a href="#">About</a></li>
		</ul>
	</nav>
	<Dropdown bind:visible>
		<Button slot="trigger" on:click={toggleDropdown}>
			<Avatar initials="DW">
				<Avatar.Indicator slot="indicator" placement="bottom-right" />
			</Avatar></Button
		>
		<Dropdown.Items slot="items">
			<a href="/dashboard"><Dropdown.Items.Item on:click={closeDropdown} label="Dashboard" /></a>
			<Dropdown.Items.Item on:click={closeDropdown} label="Profile Settings" />
			<Dropdown.Items.Item
				on:click={async () => {
					supabase.auth.signOut();
					closeDropdown();
				}}
				label="Sign Out"
			/>
		</Dropdown.Items>
	</Dropdown>

	<!-- <a href="/login"><button>Sign In</button></a> -->
</header>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Montserrat:500');
	.nav__links {
		li,
		a {
			font-family: 'Montserrat', sans-serif;
			font-weight: 500;
			font-size: 16px;
			color: #202e39;
			text-decoration: none;
		}
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
