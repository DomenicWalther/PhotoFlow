<script>
	import { Avatar, Dropdown, Button } from 'stwui';

	import { signOut, getUser } from '@lucia-auth/sveltekit/client';
	import { invalidateAll } from '$app/navigation';
	let visible = false;

	let logoSource = '/logo.svg';

	function closeDropdown() {
		visible = false;
	}

	function toggleDropdown() {
		visible = !visible;
	}

	const user = getUser();
</script>

<header>
	<a href="/"> <img src="{logoSource}" alt="logo" class="logo" /></a>
	<nav>
		<ul class="nav__links">
			<li><a href="/taskOverview">Tasks</a></li>
			<li><a href="#">Projects</a></li>
			<li><a href="#">About</a></li>
		</ul>
	</nav>
	{#if $user?.userId !== undefined}
		<Dropdown bind:visible>
			<Button slot="trigger" on:click={toggleDropdown}>
				<Avatar initials="DW">
					<Avatar.Indicator slot="indicator" placement="bottom-right" />
				</Avatar></Button
			>
			<Dropdown.Items slot="items">
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 1">
					<a href="/dashboard">Dashboard</a>
				</Dropdown.Items.Item>
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 2">
					Profile Settings
				</Dropdown.Items.Item>
				<Dropdown.Items.Item
					on:click={async () => {
						await signOut();
						invalidateAll();
						closeDropdown()
					}}
					label="Notifications"
				>
					Sign Out
				</Dropdown.Items.Item>
			</Dropdown.Items>
		</Dropdown>
	{:else}
		<a href="/login"><button>Sign In</button></a>
	{/if}
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
