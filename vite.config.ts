import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter()
		}),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			// English at "/", French at "/fr"; remember the choice in a cookie
			strategy: ['url', 'cookie', 'baseLocale']
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				// The theme is built on Bootstrap's own Sass sources, which still use @import
				silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
			}
		}
	}
});
