import type { TRole } from './enum';

const loginUser = (role: TRole) => {
	cy.visit('/dashboard/login');
	cy.get('input[placeholder="Enter your username"]').type(role);
	cy.get('input[placeholder="Enter your password"]').type(role);
	cy.get('button').contains('Login').click()
};

Cypress.Commands.addAll({ loginUser });
