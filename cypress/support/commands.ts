import type { TRole } from './enum';

const loginUser = (role: TRole) => {
	cy.visit('/dashboard/login');
	cy.get('input[placeholder="Enter your username"]').type(role);
	cy.get('input[placeholder="Enter your password"]').type(role);
	cy.get('button').contains('Login').click();
	if (role === 'Admin')
		cy.task('getUsersTOTPSecret', { username: role.toLowerCase() }).then(secret => {
			cy.task('genTOTPToken', { secret }).then(token => {
				cy.get('input[data-testid="verify_mfa_input"]').type(token as string);
				cy.contains('Submit Verification Code').click();
			});
		});
};

const loginCreds = (username: string, password: string) => {
	cy.visit('/dashboard/login');
	cy.get('input[placeholder="Enter your username"]').type(username);
	cy.get('input[placeholder="Enter your password"]').type(password);
	cy.get('button').contains('Login').click();
};

Cypress.Commands.addAll({ loginUser, loginCreds });
