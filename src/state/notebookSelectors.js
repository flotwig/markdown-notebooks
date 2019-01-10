import { createSelector } from 'redux-starter-kit';

export const getActivePage = createSelector(
    [
        (state) => state.activePageId,
        (state) => state.notebook && state.notebook.pages
    ], 
    (activePageId, pages) => {
        if (!pages) return undefined
        return pages.find(p => p._id === activePageId)
    }
)

export const getActivePageIndex = createSelector(
    [
        (state) => state.activePageId,
        (state) => state.notebook && state.notebook.pages
    ], 
    (activePageId, pages) => {
        if (!pages) return undefined
        return pages.findIndex(p => p._id === activePageId)
    }
)

