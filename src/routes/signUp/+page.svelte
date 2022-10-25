<script>
	// Importing Libraries
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { goto } from '$app/navigation';

	// Importing Components
	import NavBar from '$lib/NavBar.svelte';

	const { form, errors, state, handleChange, handleSubmit, handleReset } = createForm({
		initialValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		validationSchema: yup.object().shape({
			first_name: yup.string().required('First Name is required'),
			last_name: yup.string().required('Last Name is required'),
			email: yup.string().email("Please enter a valid E-Mail Adress.").required('Email is required'),
			password: yup.string().required('Password is required'),
			confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
		}),
		onSubmit: (values) => {
			fetch('http://localhost:3000/register', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					first_name: values.first_name,
					last_name: values.last_name,
					email: values.email,
					password: values.password
				})
			}).then((response) => {
				response.json();
				handleReset();
				goto('/taskOverview');
			});
		}
	});

</script>

<NavBar />
<div class="flex h-screen justify-center mt-8">
	<form class="w-full max-w-lg" on:submit|preventDefault={handleSubmit}>
		<div class="flex flex-wrap -mx-3 mb-2">
			<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label
					class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
					for="grid-first-name"
				>
					First Name
				</label>
				<input
					class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-900 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-first-name"
					type="text"
					placeholder="First Name"
					name="first_name"
					on:change={handleChange}
					on:blur={handleChange}
					bind:value={$form.first_name}
				/>
				{#if $errors.first_name}
					<small class="text-red-700 font-bold">{$errors.first_name}</small>
				{/if}
			</div>

			<div class="w-full md:w-1/2 px-3">
				<label
					class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
					for="grid-last-name"
				>
					Last Name
				</label>
				<input
					class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-900 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-last-name"
					type="text"
					placeholder="Last Name"
					name="last_name"
					on:change={handleChange}
					bind:value={$form.last_name}
				/>
				{#if $errors.last_name}
					<small>{$errors.last_name}</small>
				{/if}
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-4">
			<div class="w-full px-3">
				<label
					class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
					for="grid-email"
				>
					E-Mail
				</label>
				<input
					class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-900 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-email"
					type="email"
					placeholder="E-Mail Adress"
					name="email"
					bind:value={$form.email}
					on:change={handleChange}
				/>
				{#if $errors.email}
					<small>{$errors.email}</small>
				{/if}
				<label
					class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
					for="grid-password"
				>
					Password
				</label>
				<input
					class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-900 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-password"
					type="password"
					placeholder="Password"
					name="password"
					bind:value={$form.password}
					on:change={handleChange}
				/>
				<p class="text-gray-600 text-xs italic mb-4">Make it as long and as crazy as you'd like</p>
				{#if $errors.password}
					<small>{$errors.password}</small>
				{/if}
				<label
					class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
					for="grid-password-confirm"
				>
					Confirm Password
				</label>
				<input
					class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-900 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-password-confirm"
					type="password"
					placeholder="Confirm password"
					name="confirmPassword"
					bind:value={$form.confirmPassword}
					on:change={handleChange}
				/>
				{#if $errors.confirmPassword}
					<small>{$errors.confirmPassword}</small>
				{/if}
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="w-full px-3">
				<button
					class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
					type="submit">Sign Up</button
				>
			</div>
		</div>
	</form>
</div>
