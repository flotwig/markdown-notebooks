const getTextarea = () =>
    cy.get('.markdown-textarea')

// thanks https://github.com/cypress-io/cypress/issues/299#issuecomment-380197761
const pressTab = () => 
    cy.focused().trigger('keydown', {
        keyCode: 9,
        which: 9,
        shiftKey: false,
        ctrlKey: false
    });

const loadBlankPng = () =>
    cy.fixture('blank.png').then(binary => {
        return new Blob([binary])
    })

describe('Markdown Editor', () => {
    beforeEach(() => {
        cy.visit('/')
        return cy.get('.btn-new-notebook').click()
    })

    it('creates a new bullet when in a bulleted list', () => {
        getTextarea().type('- Bullet 1{enter}Bullet 2').then(() => {
            return getTextarea().should('have.value', '- Bullet 1\n- Bullet 2')
        })
    })
    
    it('cancels the bulleted list when pressing enter twice', () => {
        getTextarea().type('- Bullet 1{enter}Bullet 2{enter}{enter}').then(() => {
            return getTextarea().should('have.value', '- Bullet 1\n- Bullet 2\n')
        })
    })

    it('splits a bullet when in a bulleted list', () => {
        getTextarea().type('- Bullet 1{enter}Bullet 2{leftarrow}{enter}').then(() => {
            return getTextarea().should('have.value', '- Bullet 1\n- Bullet \n- 2')
        })
    })

    it('indents the bullet when pressing tab', () => {
        getTextarea().type('- Bullet 1{enter}Bullet 2')
        .then(pressTab)
        .then(() => {
            return getTextarea().should('have.value', '- Bullet 1\n    - Bullet 2')
        })
    })

    it('inserts 4 spaces when pressing tab', () => {
        getTextarea()
        .click()
        .then(pressTab)
        .then(() => {
            return getTextarea().should('have.value', '    ')
        })
    })

    // it.only('uploads an image when pasted', () => {
    //     return loadBlankPng(blankPng => {
    //         return getTextarea().trigger('paste', {
    //             clipboardData: {
    //                 items: [
    //                     {
    //                         type: 'image',
    //                         getAsFile: () => blankPng
    //                     }
    //                 ]
    //             }
    //         }).click()
    //     })
    // })
})
