describe('NotebookEditor', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('loads', () => {
    })

    it('renders without crashing', () => {
        cy.get('.logo-lockup').contains('Markdown')
    })

    it('does not load a notebook by default', () => {
        cy.get('.nis-no-notebook').should('exist')
    })

    context('notebook editing', () => {
        beforeEach(() => {
            return cy.get('.btn-new-notebook')
            .click()
        })

        it('creates a new notebook when asked', () => {
            cy.get('.markdown-textarea').should('exist')
            cy.get('.bp3-tag').should('contain', 'No Unsaved Changes')
        })

        it('has save disabled by default', () => {
            return cy.get('.btn-save-notebook')
            .should('have.attr', 'disabled')
        })

        it('can add a new notebook page', () => {
            cy.get('.btn-new-page')
            .contains('New Page')
            .click()
            .then(() => {
                return cy.get('.page-list > .bp3-tab-list > .bp3-tab')
                .should('have.length', 2)
            })
        })

        it('can delete the only notebook page and end up with a new page', () => {
            cy.get('.btn-delete-page')
            .contains('Delete Page')
            .click()
            .then(() => {
                return cy.get('.page-list > .bp3-tab-list > .bp3-tab')
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
                return cy.get('.btn-save-notebook')
                .should('not.have.attr', 'disabled')
            })
        })
    })
})
