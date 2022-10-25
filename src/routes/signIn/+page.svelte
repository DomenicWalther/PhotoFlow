<script>
    	// Importing Libraries
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { goto } from '$app/navigation';

    const { form, errors, state, handleChange, handleSubmit, handleReset } = createForm({
        initialValues: {
            email: '',
            password: ''
        },

        validationSchema: yup.object().shape({
            email: yup.string().email("You need to enter a valid E-Mail Adress").required("Please enter your E-Mail Adress"),
            password: yup.string().required("Please enter your password")
        }),

        onSubmit: (values) => {
            console.log(values)
        }
    })

</script>

<div class="flex h-screen justify-center mt-8">
	<form class="w-full max-w-lg" on:submit|preventDefault={handleSubmit}>
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
				{#if $errors.password}
					<small>{$errors.password}</small>
				{/if}
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="w-full px-3">
				<button
					class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
					type="submit">Sign In</button
				>
			</div>
		</div>
	</form>
</div>
