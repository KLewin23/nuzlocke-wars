import { auth } from '@auth';

const seed = async () => {
	await auth.api.signUpEmail({
		body: {
			email: 'basic@basic.com',
			name: 'Basic',
			username: 'Basic',
			password: 'Basic123.',
		},
	});
	await auth.api.signUpEmail({
		body: {
			email: 'admin@admin.com',
			name: 'Admin',
			username: 'Admin',
			password: 'Admin123.',
		},
	});
	await auth.api.signUpEmail({
		body: {
			email: 'super@super.com',
			name: 'Super',
			username: 'Super',
			password: 'Super123.',
		},
	});
};

seed()
	.then(() => console.log('Successfully seeded db'))
	.catch(e => console.log(`Failed to seed db ${e}`));
