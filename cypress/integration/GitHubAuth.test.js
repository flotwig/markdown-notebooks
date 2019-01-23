import GitHubLoginPrompt from '../../src/components/auth/GitHubLoginPrompt';

/**
 * Given a name, find the first React component with the same class name in the rendered DOM
 * 
 * @param {string} name target name to find
 */
const componentFromName = (name) => {
    const root = cy.state('document').documentElement

    const childFinder = function(element) {
        const reactKey = Object.keys(element).find(key => key.substring(0,23) === '__reactInternalInstance')
        if (reactKey && element[reactKey]._debugOwner.type.name === name) {
            return element[reactKey]._debugOwner.stateNode
        }
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i]
            const foundElement = childFinder(child)
            if (foundElement) return foundElement
        }
    }

    const obj = { childFinder }
    return cy.wrap(obj).invoke('childFinder', root).should('be.ok')
}

describe('GitHub Auth', () => {
    beforeEach(()=>{
        cy.visit('/')
    })

    // it('pops up when a user is unauthenticated', () => {
    //     cy.contains('Log in with GitHub')
    // })

    // // it.only('redirects to GitHub auth when login is clicked', function() {
    // //     cy.window().then(cyWindow => {
    // //         componentFromName('GitHubLoginPrompt').then(component => {
    // //             cy.stub(component, 'redirectTo').as('redirectTo')
    // //             cy.get('.gh-login-button').click().then(()=>{
    // //                 expect(component.redirectTo).to.be.called
    // //             })
    // //         })
    // //     })
    // // })
})