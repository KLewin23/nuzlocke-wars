/* eslint-disable */
import { db } from '@/db';
import { auth } from '@/auth/auth';
import { env } from '@/env/server';
import { Role } from '@/db/authSchema';
import { defineConfig } from 'cypress';
import { createOTP } from '@better-auth/utils/otp';
import { symmetricDecrypt } from 'better-auth/crypto';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default defineConfig({
	e2e: {
		retries: 0,
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
			on('task', {
				async addAdminUser({ username, password }) {
					await auth.api.createUser({
						body: {
							email: `${username}@nuzlocke-wars.com`,
							name: username,
							password: password,
							role: Role.admin,
							data: {
								username: username,
							},
						},
					});
					const user = await retryPromise(3, db.query.user.findFirst({ where: { username } }));
					if (Error.isError(user)) throw user;
					return user;
				},
				async getUsersTOTPSecret({ username }) {
					const user = await retryPromise(
						10,
						db.query.user.findFirst({
							columns: { username: true },
							with: {
								twoFactors: {
									limit: 1,
									columns: {
										secret: true,
									},
								},
							},
							where: {
								username,
							},
						}),
						d => d.twoFactors.length > 0,
						1,
					);
					if (Error.isError(user)) throw user;
					const twoFactor = user.twoFactors.at(0);
					if (!twoFactor) throw new Error(`No two factor secrets found for user ${username}`);
					return twoFactor.secret;
				},
				async genTOTPToken({ secret }) {
					const s = await symmetricDecrypt({ data: secret, key: env.BETTER_AUTH_SECRET });
					return createOTP(s).totp();
				},
			});
		},
	},
	numTestsKeptInMemory: 1,
	video: true,
	
});

// retries if promise response is undefined
const retryPromise = async <R>(
	retries = 3,
	promise: Promise<R | undefined>,
	extraConfition?: (value: R) => boolean,
	delaySeconds = 0.5,
): Promise<R | Error> => {
	const delayMillis = delaySeconds * 1000;
	const recur = async (counter = 0): Promise<R | Error> => {
		const response = await promise;
		if (!response && counter < retries - 1) {
			await delay(delayMillis);
			return recur(counter + 1);
		}
		if (!response) return new Error(`Item not returned after ${retries} retries`);
		if (extraConfition === undefined) return response;
		const conditionResult = extraConfition(response);
		if (!conditionResult && counter < retries - 1) {
			await delay(delayMillis);
			return recur(counter + 1);
		}
		if (conditionResult === true) return response;
		return new Error(`Item not returned after ${retries} retries`);
	};
	return recur();
};

const delay = (delayMillis: number) => new Promise(resolve => setTimeout(resolve, delayMillis));
