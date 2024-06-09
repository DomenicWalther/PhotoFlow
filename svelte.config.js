import adapter from '@sveltejs/adapter-node';
import preprocessor from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocessor({
			postcss: true
		})
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
