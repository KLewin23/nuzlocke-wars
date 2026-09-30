declare global {
    namespace Cypress {
        interface Chainable {
            // put custom commands here e.g.
            // login: (uname: string, pword: string) => Chainable<void>
        }
    }
}

export {}