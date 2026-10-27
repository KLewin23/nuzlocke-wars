/* eslint-disable */
import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default defineConfig({
	e2e: {
		retries: 3,
		baseUrl: 'http://localhost:3000',
		setupNodeEvents: on => {
			const options = webpackPreprocessor.defaultOptions;
			if (options.webpackOptions) {
				options.webpackOptions.resolve = {
					...options.webpackOptions.resolve,
					plugins: [new TsconfigPathsPlugin()],
				};
			} else {
				throw new Error('Malformed webpack options, Unexpected: `webpackOptions` is undefined');
			}

			on('file:preprocessor', webpackPreprocessor(options));
		},
	},
	numTestsKeptInMemory: 1,
});
