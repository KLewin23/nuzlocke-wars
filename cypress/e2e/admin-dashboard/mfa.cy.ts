describe('Multi-factor Authentication', () => {
	it('Should block data loading without mfa setup', () => {
		const credentials = `user_${new Date().valueOf()}`;
		cy.task('addAdminUser', { username: credentials, password: credentials });
		cy.loginCreds(credentials, credentials);
		cy.contains('Multi Factor Authentication Is Required');
		cy.contains('Close').click();
		cy.contains('Something went wrong retrieving data');
		cy.contains('Users').click();
		cy.contains('Close').click();
		cy.contains('Something went wrong retrieving data');
		cy.contains('Settings').click();
		cy.get('input[placeholder="Enter password."]').type(credentials);
		cy.contains('Enable MFA').click();
		// cy.wait(1000)
		// cy.task('getUsersTOPTSecret', { username: credentials }).then(secret => {
		// 	cy.task('genTOTPToken', { secret }).then(token => {
		// 		cy.get('input[data-testid="verify_mfa_input"]').type(token as string)
		// 		cy.contains('Submit Verification Code').click();
		// 	});	
		// });
	});
});
