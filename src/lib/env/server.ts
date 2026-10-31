import { z } from 'zod';

const envSchema = z.intersection(
	z.object({
		BETTER_AUTH_SECRET: z.string(),
		BASE_URL: z.string(),
		VERCEL_ENV: z.union([
			z.literal('local'),
			z.literal('development'),
			z.literal('preview'),
			z.literal('production'),
		]),
		NODE_ENV: z.union([z.literal('test'), z.literal('development'), z.literal('production')]).optional(),
		ABLY_PUBLISH_API_KEY: z.string(),
		ABLY_SUBSCRIBE_API_KEY: z.string(),
	}),
	z.union([
		z.object({
			DATABASE_USERNAME: z.string(),
			DATABASE_PASSWORD: z.string(),
			DATABASE_NAME: z.string(),
			DATABASE_PORT: z.string().transform(s => parseInt(s, 10)),
			DATABASE_HOST: z.string(),
			DATABASE_CA_CERTIFICATE: z
				.string()
				.transform(s => Buffer.from(s, 'base64').toString())
				.optional(),
		}),
		z.object({
			DATABASE_CONNECTION_URL: z.string(),
		}),
	]),
);

// const env = createEnv({
// 	server: {
// 		DATABASE_USERNAME: z.string().optional(),
// 		DATABASE_PASSWORD: z.string().optional(),
// 		DATABASE_NAME: z.string().optional(),
// 		DATABASE_PORT: z
// 			.string()
// 			.optional()
// 			.transform(s => parseInt(s, 10)),
// 		DATABASE_HOST: z.string().optional(),
// 		DATABASE_CA_CERTIFICATE: z
// 			.string()
// 			.transform(s => Buffer.from(s, 'base64').toString())
// 			.optional(),
// 		DATABASE_CONNECTION_URL: z.string().optional(),
// 		BETTER_AUTH_SECRET: z.string(),
// 		BASE_URL: z.string(),
// 		VERCEL_ENV: z.union([
// 			z.literal('local'),
// 			z.literal('development'),
// 			z.literal('preview'),
// 			z.literal('production'),
// 		]),
// 		NODE_ENV: z.union([z.literal('test'), z.literal('development'), z.literal('production')]).optional(),
// 		ABLY_PUBLISH_API_KEY: z.string(),
// 		ABLY_SUBSCRIBE_API_KEY: z.string(),
// 	},
// 	runtimeEnv: process.env,
// 	createFinalSchema: shape => targetShape.parse(shape),
// });

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.parse(process.env);

export { env, type Env };
