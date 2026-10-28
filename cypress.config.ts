/* eslint-disable */
import { db } from '@/db';
import { symmetricDecrypt } from "better-auth/crypto";
import { OTP, stringToBytes } from 'otplib';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth/auth';
import { defineConfig } from 'cypress';
import { Role, twoFactor, user } from '@/db/authSchema';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { env } from '@/env/server';

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
			on('task', {
				async addAdminUser({ username, password }) {
					return auth.api.createUser({
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
				},
				async getUsersTOPTSecret({ username }) {
					return(await db
						.select({ secret: twoFactor.secret, user: user.username, id: user.id })
						.from(user)
						.innerJoin(twoFactor, eq(twoFactor.userId, user.id))
						.where(eq(user.username, username)))[0].secret;
				},
				async genTOTPToken({ secret }) {
					const otp = new OTP();
					const s = await symmetricDecrypt({data: secret, key: env.BETTER_AUTH_SECRET})
					console.log(s)
					return otp.generate({ secret: s });
				},
			});
		},
	},
	numTestsKeptInMemory: 1,
});
