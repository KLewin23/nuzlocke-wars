import { Role } from '../../support/enum';

describe('/dashboard/admin/users/* path', () => {
	it('should redirect non admin users', () => {
		cy.loginUser(Role.Basic);
		cy.contains('Drafts');
		cy.visit('/dashboard/admin/users');
		cy.location('pathname').should('eq', '/dashboard/drafts');
	});
	describe('when authenticated as an admin', () => {
		beforeEach(() => cy.loginUser(Role.Admin));
		it('can retrieve a list of existing user', () => {
			cy.contains('Users').click();
			cy.get('tr td:contains("admin")').should('exist');
			cy.get('tr td:contains("basic")').should('exist');
		});
		it('can create multiple users', () => {
			cy.contains('Users').click();
			cy.contains('Create User').click();
			const users = Array.from(Array(3)).map((_, index) => `${new Date().valueOf()}${index}`);
			users.forEach(username => {
				cy.get('fieldset[data-testid="new-user-form"]').within(() => {
					cy.get('input[placeholder="Enter username."]').type(username);
					cy.get('input[placeholder="Enter password."]').type(username);
					cy.get('input[placeholder="Enter profile image url."]').type('https://picsum.photos/300/300');
					cy.get('button[role="combobox"]').contains('User').click({ force: true });
					cy.contains('Admin').should('exist');
				});
				cy.contains('Stage User').click({force: true});
			});
			cy.contains('Submit Staged Users').click();
			cy.contains('Users Created');
			cy.contains('3 users successfully created.');
		});
		it('is blocked from creating a user with invalid fields', () => {
			cy.contains('Users').click();
			cy.contains('Create User').click();
			cy.contains('Stage User').click();
			cy.contains('A username is required.');
			cy.get('input[placeholder="Enter username."]').type('t');
			cy.contains('Stage User').click();
			cy.contains('Username must be at least 3 characters long.');
			cy.get('input[placeholder="Enter username."]').type(new Date().valueOf().toString());
			cy.contains('Stage User').click();
			cy.contains('A profile image is required.');
			cy.get('input[placeholder="Enter profile image url."]').type('https://picsum.photos/300/300');
			cy.contains('Stage User').click();
			cy.contains('Submit Staged Users').click();
			cy.contains('Users Created');
			cy.contains('1 user successfully created.');
		});
	});
});
