import Notebook from '../../models/Notebook';
import NotebookPage from '../../models/NotebookPage';

const mockGist = {

}

it('creates a notebook with one page by default', () => {
    const notebook = new Notebook();
    expect(notebook.pages).toHaveLength(1);
})

it('returns sequential untitled page titles', () => {
    const notebook = new Notebook();
    notebook.pages.push(new NotebookPage(notebook.getUnusedName()));
    notebook.pages.push(new NotebookPage(notebook.getUnusedName()));
    expect(notebook.pages[0].name).toEqual('Untitled Page');
    expect(notebook.pages[1].name).toEqual('Untitled Page (1)');
    expect(notebook.pages[2].name).toEqual('Untitled Page (2)');
})