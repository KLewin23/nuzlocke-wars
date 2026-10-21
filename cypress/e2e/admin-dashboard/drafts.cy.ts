import { Role } from '../../support/enum';

describe('/dashboard/admin/drafts/* path', () => {
	it('should redirect non admin users', () => {
		cy.loginUser(Role.Basic);
		cy.contains('Drafts');
		cy.visit('/dashboard/admin/drafts');
		cy.location('pathname').should('eq', '/dashboard/drafts');
	});
	describe('when authenticated as an admin', () => {
		beforeEach(() => cy.loginUser(Role.Admin));
		it('can create a draft with a new team', () => {
			const epoch = new Date().valueOf();
			const draftName = `${epoch}-draft`;
			const teamName = `${epoch}-team`;
			cy.contains('Create Draft').click();
			cy.get('input[placeholder="Enter draft name."]').type(draftName);
			cy.contains('Select Existing Team').click();
			cy.contains("Select or type team's name...").click();
			cy.get('input[placeholder="Search or add teams..."]').type(teamName);
			cy.contains('Create Team: ').click();
			cy.contains('Select The Team Captain').click();
			cy.get('div[role="option"]').contains('admin').click();
			cy.contains('Add New Team').click();
			cy.contains('Team staged.');
			cy.contains('Select a player to add.').click();
			cy.get('div[role="option"]').contains('basic').click();
			cy.contains('Add User').click();
			cy.contains('Submit Draft').click();
            cy.contains(`Draft: \`${draftName}\` successfully created`)
		});
	});
});
