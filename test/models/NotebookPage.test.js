import NotebookPage from '../../src/models/NotebookPage';

const mockGistFile = {
    content: 'Test',
    filename: '1. Test File.md'
}

describe('NotebookPage model', () => {
    it('increments page ID with each page', () => {
        const pageA = new NotebookPage();
        const pageB = new NotebookPage();
        expect(pageB._id - pageA._id).toBe(1);
    })

    it('generates page from a gistfile', () => {
        const page = NotebookPage.fromGistFile(mockGistFile);
        expect(page).toMatchObject({
            content: 'Test',
            name: 'Test File',
            gistFilename: '1. Test File.md'
        })
    })

    it('converts a loaded gistfile page back to a gistfile', () => {
        const page = NotebookPage.fromGistFile(mockGistFile);
        const gistFile = page.toGistFile(mockGistFile.filename)
        expect(gistFile).toMatchObject({
            content: 'Test',
            filename: '1. Test File.md'
        })
    })
})