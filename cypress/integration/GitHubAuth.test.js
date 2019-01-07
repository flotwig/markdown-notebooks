import GitHubLoginPrompt from '../../src/components/auth/GitHubLoginPrompt';

describe('GitHub Auth', () => {
    it('pops up when a user is unauthenticated', () => {
        cy.visit('/')
        cy.contains('Log in with GitHub')
    })

    // it('redirects to GitHub auth when login is clicked', function() {
    //     cy.stub(GitHubLoginPrompt.prototype, 'redirectTo')
    //     cy.get('.gh-login-button').click()
    //     expect(GitHubLoginPrompt.prototype.redirectTo).to.be.called()
    // })
})