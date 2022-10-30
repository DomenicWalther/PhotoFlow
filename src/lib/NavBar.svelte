<script>
	import { Avatar, Dropdown, Button, Badge } from 'stwui';
	import { signedIn } from './store.js';

	let visible = false;

	let src = './logo.svg';

	const signIn = () => {
		$signedIn = true;
	};

	const signOut = () => {
		$signedIn = false;
	};

	function closeDropdown() {
		visible = false;
	}

	function toggleDropdown() {
		visible = !visible;
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
		<!-- <Dropdown bind:visible={visible}>
			<Avatar initials="DW" on:click={signOut} on:click={toggleDropdown}>
				<Avatar.Indicator slot="indicator" placement="bottom-right" />
			</Avatar>
			<Dropdown.Items slot="items">
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 1">
					<Dropdown.Items.Item.Icon slot="icon"/>
				</Dropdown.Items.Item>
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 2">
					<Dropdown.Items.Item.Icon slot="extra"/>
				</Dropdown.Items.Item>
				<Dropdown.Items.Item on:click={closeDropdown} label="Notifications">
					<Badge type="info" slot="extra">+99</Badge>
				</Dropdown.Items.Item>
				<Dropdown.Items.Divider />
			</Dropdown.Items>
		</Dropdown> -->
		<Dropdown bind:visible={visible}>
			<Button slot="trigger" on:click={toggleDropdown}>
				<Avatar initials="DW" on:click={signOut} on:click={toggleDropdown}>
					<Avatar.Indicator slot="indicator" placement="bottom-right" />
				</Avatar></Button>
			<Dropdown.Items slot="items">
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 1">
					Dashboard
				</Dropdown.Items.Item>
				<Dropdown.Items.Item on:click={closeDropdown} label="Item 2">
					Profile Settings
				</Dropdown.Items.Item>
				<Dropdown.Items.Item on:click={closeDropdown} label="Notifications">
					Sign Out
				</Dropdown.Items.Item>
			</Dropdown.Items>
		</Dropdown>
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
