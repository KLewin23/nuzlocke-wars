import logger from '@/logger';
import { auth } from '@/auth/auth';
import generator from 'generate-password';

const main = async () => {
	const password = generator.generate({
		length: 18,
		numbers: true,
		symbols: true,
		strict: true,
	});
	await auth.api.createUser({
		body: {
			email: 'root@nuzlocke-wars.com',
			name: 'Root',
			password: password,
			role: 'admin',
			data: {
				username: 'Root',
			},
		},
	});
	logger.info(`Root generated, password: ${password}`)
};

main()
	.then(() => logger.info('Successfully seeded db'))
	.catch(e => logger.error(e, `Failed to seed db ${e}`));
