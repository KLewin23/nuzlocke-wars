import dateAsSimpleString from '../../support/dateAsSimpleString';

describe('Multi-factor Authentication', () => {
	it('Should block data loading without mfa setup', () => {
		const credentials = dateAsSimpleString(new Date());
		cy.task('addAdminUser', { username: credentials, password: credentials });
		cy.loginCreds(credentials, credentials);
		cy.contains('Multi Factor Authentication Is Required');
		cy.contains('Close').click();
		cy.contains('Something went wrong retrieving data');
		cy.contains('Users').click();
		cy.contains('Close').click();
		cy.contains('Something went wrong retrieving data');
	});
	it('Should allow a user to setup MFA, and give them access to data', () => {
		const credentials = dateAsSimpleString(new Date());
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
		cy.task('getUsersTOTPSecret', { username: credentials }).then(secret => {
			cy.task('genTOTPToken', { secret }).then(token => {
				cy.get('input[data-testid="verify_mfa_input"]').type(token as string);
				cy.contains('Submit Verification Code').click();
				cy.contains('Code was validated, you will now have full access to Nuzlock Wars.');
			});
		});
		cy.contains('Users').click()
		cy.contains(credentials)
	});
});
