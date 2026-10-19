import { Role } from '@/db';
import { auth } from '@/auth/auth';
import logger from '@/logger';

const seed = async () => {
	await auth.api.createUser({
		body: {
			email: 'basic@basic.com',
			name: 'Basic',
			password: 'Basic123.',
			role: Role.user,
			data: {
				username: 'Basic',
			},
		},
	});
	await auth.api.createUser({
		body: {
			email: 'admin@admin.com',
			name: 'Admin',
			password: 'Admin123.',
			role: 'admin',
			data: {
				username: 'Admin',
			},
		},
	});
};

seed()
	.then(() => logger.info('Successfully seeded db'))
	.catch(e => logger.error(`Failed to seed db ${e}`));
