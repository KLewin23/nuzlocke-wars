import type { TRole } from './enum';

declare global {
	namespace Cypress {
		interface Chainable {
			// put custom commands here e.g.
			// login: (uname: string, pword: string) => Chainable<void>
			loginUser: (role: TRole) => Chainable<void>;
			loginCreds: (username: string, password: string) => Chainable<void>;
			task: (event: 'addAdminUser', params: { username: string; password: string }) => Chainable<void>;
			task: (event: 'getUsersTOPTSecret', params: { username: string }) => Chainable<void>;
			task: (event: 'genTOTPToken', params: { secret: string }) => Chainable<void>;
		}
	}
}
