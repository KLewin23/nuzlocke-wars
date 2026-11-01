describe('Home', () => {
    it('should render', () => {
        cy.visit('/')
        cy.contains('CARNIVAL')
        cy.contains('Home')
        cy.contains('Content')
        // cy.contains('WARRIORS')
        // cy.contains('HIGHLIGHTS')
        // cy.contains('FAQ')
    })
})