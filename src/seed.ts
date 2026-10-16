import { Role } from '@/db';
import { auth } from '@/auth';
import logger from '@/logger';

const seed = async () => {
	await auth.api.signUpEmail({
		body: {
			email: 'basic@basic.com',
			name: 'Basic',
			username: 'Basic',
			password: 'Basic123.',
			role: Role.basic,
		},
	});
	await auth.api.signUpEmail({
		body: {
			email: 'admin@admin.com',
			name: 'Admin',
			username: 'Admin',
			password: 'Admin123.',
			role: Role.admin,
		},
	});
	await auth.api.signUpEmail({
		body: {
			email: 'super@super.com',
			name: 'Super',
			username: 'Super',
			password: 'Super123.',
			role: Role.super,
		},
	});
};

seed()
	.then(() => logger.info('Successfully seeded db'))
	.catch(e => logger.error(`Failed to seed db ${e}`));
