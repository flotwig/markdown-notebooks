import NotebookPage from "./NotebookPage";

export default class Notebook {
    modified = false; // has it been modified since being loaded/created?
    public = false;
    created_at = new Date();
    updated_at = undefined;
    saved_at = undefined;
    gistId = ''; // if empty, has never been saved to Gist
    gistOwnerLogin = ''; // GitHub username
    name = 'Untitled Notebook'; // description on Gist
    pages = [new NotebookPage()]; // array of pages

    static fromGist(gist) {
        return Object.assign(new Notebook(), {
            public: gist.public,
            created_at: new Date(gist.created_at),
            updated_at: new Date(gist.updated_at),
            saved_at: new Date(gist.updated_at),
            gistId: gist.id,
            gistOwnerLogin: gist.owner.login,
            name: gist.description,
            pages: Object.keys(gist.files).map(filename => {
                let file = gist.files[filename];
                return NotebookPage.fromGistFile(file);
            })
        })
    }
}