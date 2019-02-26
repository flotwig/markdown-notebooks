import { Promise } from "bluebird";
import { getTextarea, loadNotebook } from '../support/util'

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
        loadNotebook('empty')
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

    context('checkboxes', () => {
        beforeEach(() => {
            getTextarea()
            .click()
            .type('- [x] c\n- [ ] \n- <input type="checkbox">\n- [ ] d')
        })

        it('render correctly', () => {
            cy.get('.markdown-renderer input[type=checkbox]')
            .then(children => {
                expect(children).to.have.length(4)
                expect(children[0]).to.be.checked.and.not.be.disabled
                expect(children[1]).to.not.be.checked.and.not.be.disabled
                expect(children[2]).to.be.disabled.and.not.be.checked
                expect(children[3]).to.not.be.checked.and.not.be.disabled
            })
        })

        it('can be checked to affect the markdown', () => {
            cy.get('.markdown-renderer input[type="checkbox"]')
            .then(children => {
                children[0].click()
                getTextarea().should('have.value', '- [ ] c\n- [ ] \n- <input type="checkbox">\n- [ ] d')
                Promise.mapSeries([0, 2, 3], i => {
                    return cy.get('.markdown-renderer input[type="checkbox"]').then(children => {
                        return children[i].click()
                    })
                }).then(() => {
                    getTextarea().should('have.value', '- [x] c\n- [ ] \n- <input type="checkbox">\n- [x] d')
                })
            })
        })
    })

    // it('uploads an image when pasted', (done) => {
    //     return loadBlankPng().then(blankPng => {
    //         return getTextarea().click().trigger('paste', {
    //             clipboardData: {
    //                 items: [
    //                     {
    //                         type: 'image',
    //                         getAsFile: () => blankPng
    //                     }
    //                 ]
    //             }
    //         }).click().then(done)
    //     })
    // })
})
