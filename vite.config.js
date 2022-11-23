import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	define: {
		'process.env': process.env
},
};

export default config;
