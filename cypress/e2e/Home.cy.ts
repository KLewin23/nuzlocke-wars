describe('Home', () => {
    it('should render', () => {
        cy.visit('/')
        cy.contains('HOME')
        cy.contains('WARRIORS')
        cy.contains('HIGHLIGHTS')
        cy.contains('FAW')
    })
})