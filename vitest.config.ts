import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'happy-dom',
		coverage: {
			provider: 'v8',
			include: ['scripts/**/*.ts', 'src/**/*.ts']
		}
	},
	esbuild: {
		supported: {
			'top-level-await': true
		}
	}
});
