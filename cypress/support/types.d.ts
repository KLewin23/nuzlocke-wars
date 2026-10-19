import type { TRole } from './enum';

declare global {
	namespace Cypress {
		interface Chainable {
			// put custom commands here e.g.
			// login: (uname: string, pword: string) => Chainable<void>
			loginUser: (role: TRole) => Chainable<void>;
		}
	}
}
