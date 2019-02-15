describe('App', () => {
    it('loads', () => {
        cy.visit('/')
    })

    it('renders without crashing', () => {
        cy.visit('/')
        cy.get('.logo-lockup').contains('Markdown')
    })
})