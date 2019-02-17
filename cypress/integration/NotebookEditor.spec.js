describe('NotebookEditor', () => {
    context('notebook editing', () => {
        beforeEach(() => {
            cy.visit('/')
            cy.get('.btn-new-notebook')
            .click()
        })

        it('creates a new notebook when asked', () => {
            cy.get('.markdown-textarea').should('exist')
            cy.get('.bp3-tag').should('contain', 'No Unsaved Changes')
        })

        it('has save disabled by default', () => {
            cy.get('.btn-save-notebook.bp3-disabled')
        })

        it('can add a new notebook page', () => {
            cy.get('.btn-new-page')
            .contains('New Page')
            .click()
            .then(() => {
                return cy.get('.btn-page')
                .should('have.length', 2)
            })
        })

        it('can delete the only notebook page and end up with a new page', () => {
            cy.get('.btn-delete-page')
            .contains('Delete Page')
            .click()
            .then(() => {
                return cy.get('.btn-page')
                .should('have.length', 1)
            })
        })

        context('types in the textarea', () => {
            beforeEach(() => {
                return cy.get('.markdown-textarea')
                .type('Hello world!')
            })

            it('and renders', () => {
                return cy.get('.markdown-renderer')
                .contains('Hello world!')
                .then(()=> {
                    return cy.get('.markdown-renderer > p').should('contain', 'Hello world!')
                })
            })

            it('and marks unsaved changes', () => {
                return cy.get('.tag-unsaved-changes')
                .should('contain', 'Unsaved Changes')
            })

            it('and can click the save button', () => {
                cy.get('.btn-save-notebook').should('not.have.class', 'bp3-disabled')
            })
        })
    })
})
