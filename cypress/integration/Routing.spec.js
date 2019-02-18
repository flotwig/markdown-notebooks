describe('Routing', () => {
    beforeEach(() => {
        cy.server()
    })

    it('loads a gist based on url and errors', () => {
        cy.route({
            url: 'https://api.github.com/gists/doesntexist',
            response: 'fixture:gists/not-found',
            status: 404
        }).as('notFound')
        cy.visit('/fakeuser/doesntexist')
        cy.wait('@notFound')
        cy.contains('Error loading notebook')
    })

    it('loads a gist based on url and succeeds', () => {
        cy.route({
            url: 'https://api.github.com/gists/affdb6774dad57b2dd3a6a8c1eda5396',
            response: 'fixture:gists/stale-simple'
        }).as('response')
        cy.visit('/fakeuser/affdb6774dad57b2dd3a6a8c1eda5396')
        cy.wait('@response')
        cy.get('.h-notebook-name').contains('Ideabook Stale')
    })
})
