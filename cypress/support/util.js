import { SET_ACTIVE_NOTEBOOK, RECEIVE_NOTEBOOK } from '../../src/state/notebookActions'
import Notebook from '../../src/models/Notebook'

export const getTextarea = () =>
    cy.get('.markdown-textarea')

export const getAppState = () =>
    cy.window().its('store').invoke('getState')

export const dispatchAppAction = (action) =>
    cy.window().its('store').invoke('dispatch', action)

export const loadNotebook = (name) =>
    cy.fixture(`notebooks/${name}.json`).then(notebook =>
        dispatchAppAction(SET_ACTIVE_NOTEBOOK(new Notebook(notebook)))
    )

export const loadGist = (name) =>
    cy.fixture(`gists/${name}.json`).then(gist =>
        dispatchAppAction(RECEIVE_NOTEBOOK(gist))
    )
