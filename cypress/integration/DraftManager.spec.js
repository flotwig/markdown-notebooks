import { getTextarea, loadNotebook, loadGist } from '../support/util'

describe('DraftManager', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    context('with a notebook', () => {
        beforeEach(() => {
            loadNotebook('simple')
        })

        it('saves a draft on change', () => {
            getTextarea().click().type('chg')
            const { notebook, activePageId } = JSON.parse(localStorage.getItem('draft.affdb6774dad57b2dd3a6a8c1eda5396'))
            expect(notebook.pages).to.have.length(2)
            expect(activePageId).to.equal(1)
        })

        it('restores a draft automatically', () => {
            getTextarea().click().type('chg')
            cy.reload()
            cy.get(".h-notebook-name").should('contain', 'Ideabook')
        })
    })

    context('when opening a stale remote copy', () => {
        beforeEach(() => {
            loadNotebook('simple')
            getTextarea().click().type('chg')
            cy.get('.btn-new-notebook').click()
            loadGist('stale-simple')
        })

        it('prompts the user to load local changes and can restore a draft', () => {
            cy.get('.h-notebook-name').should('contain', 'Ideabook Stale')
            cy.get('.dialog-draft')
            .should('be', 'visible')
            cy.get('.btn-restore-draft').click()
            cy.get('.dialog-draft')
            .should('not.be', 'visible')
            cy.get('.h-notebook-name').should('contain', 'Ideabook')
        })

        it('can discard a draft', () => {
            cy.get('.btn-discard-draft').click()
            cy.get('.dialog-draft')
            .should('not.be', 'visible')
            cy.get('.h-notebook-name').should('contain', 'Ideabook Stale')
        })
    })
})
