describe('GitHub Auth', () => {
    beforeEach(()=>{
        cy.visit('/')
    })

    it('does not appear by default', () => {
        cy.get('.btn-new-notebook').click().then(() => {
            return cy.get('.dialog-github-auth')
            .should('not.exist')
        })
    })

    it('prompts when clicking Open', () => {
        cy.get('.btn-open-notebook').click().then(() => {
            return cy.get('.dialog-github-auth')
            .should('be.visible')
        })
    })

    it('prompts when clicking Save after creating a notebook', () => {
        return cy.get('.btn-new-notebook')
        .click()
        .then(() => {
            return cy.get('.markdown-textarea')
            .type('blah')
            .then(() => {
                return cy.get('.btn-save-notebook')
                .click()
                .then(() => {
                    return cy.get('.dialog-github-auth')
                    .should('be.visible')
                })
            })
        })
    })

    it('redirects to GitHub when clicking login button', () => {
        cy.get('.btn-open-notebook').click()
        cy.get('.btn-github-login').click()
        cy.url().should('contain', '__github/login/oauth/authorize')
    })
})
