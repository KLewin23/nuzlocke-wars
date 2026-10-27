describe('Home', () => {
    it('should render', () => {
        cy.visit('/')
        cy.contains('WARRIORS')
        cy.contains('HIGHLIGHTS')
        cy.contains('FAQ')
    })
})